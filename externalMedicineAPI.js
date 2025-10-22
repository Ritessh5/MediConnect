// Enhanced External Medicine API using RxNorm
const RXNORM_API = 'https://rxnav.nlm.nih.gov/REST';

/**
 * Search medicines by name
 * @param {string} name - Medicine name to search
 * @returns {Promise<Array>} - Array of medicine objects
 */
export const searchMedicineByName = async (name) => {
  try {
    const response = await fetch(`${RXNORM_API}/drugs.json?name=${encodeURIComponent(name)}`);
    const data = await response.json();
    
    if (data.drugGroup && data.drugGroup.conceptGroup) {
      const medicines = [];
      
      // Process all concept groups
      data.drugGroup.conceptGroup.forEach(group => {
        if (group.conceptProperties) {
          group.conceptProperties.forEach(concept => {
            medicines.push({
              rxcui: concept.rxcui,
              name: concept.name,
              synonym: concept.synonym || '',
              tty: concept.tty, // Term type (e.g., IN - ingredient, SBD - semantic branded drug)
              language: concept.language
            });
          });
        }
      });
      
      return medicines;
    }
    
    return [];
  } catch (error) {
    console.error('RxNorm API error:', error);
    return [];
  }
};

/**
 * Get detailed information about a medicine by RXCUI
 * @param {string} rxcui - RxNorm Concept Unique Identifier
 * @returns {Promise<Object>} - Detailed medicine information
 */
export const getMedicineDetails = async (rxcui) => {
  try {
    const response = await fetch(`${RXNORM_API}/rxcui/${rxcui}/allProperties.json?prop=all`);
    const data = await response.json();
    
    if (data.propConceptGroup && data.propConceptGroup.propConcept) {
      const properties = {};
      data.propConceptGroup.propConcept.forEach(prop => {
        properties[prop.propName] = prop.propValue;
      });
      return properties;
    }
    
    return {};
  } catch (error) {
    console.error('RxNorm details error:', error);
    return {};
  }
};

/**
 * Search medicines by approximate spelling
 * @param {string} term - Search term (can be misspelled)
 * @returns {Promise<Array>} - Array of medicine suggestions
 */
export const searchMedicineApproximate = async (term) => {
  try {
    const response = await fetch(`${RXNORM_API}/approximateTerm.json?term=${encodeURIComponent(term)}&maxEntries=20`);
    const data = await response.json();
    
    if (data.approximateGroup && data.approximateGroup.candidate) {
      return data.approximateGroup.candidate.map(candidate => ({
        rxcui: candidate.rxcui,
        name: candidate.name,
        score: candidate.score,
        rank: candidate.rank
      }));
    }
    
    return [];
  } catch (error) {
    console.error('RxNorm approximate search error:', error);
    return [];
  }
};

/**
 * Get related medicines (generic alternatives, brand names, etc.)
 * @param {string} rxcui - RxNorm Concept Unique Identifier
 * @returns {Promise<Object>} - Related medicines grouped by relationship
 */
export const getRelatedMedicines = async (rxcui) => {
  try {
    const response = await fetch(`${RXNORM_API}/rxcui/${rxcui}/related.json?tty=SBD+SCD+GPCK+BPCK`);
    const data = await response.json();
    
    const related = {
      branded: [],
      generic: [],
      alternatives: []
    };
    
    if (data.relatedGroup && data.relatedGroup.conceptGroup) {
      data.relatedGroup.conceptGroup.forEach(group => {
        if (group.conceptProperties) {
          const type = group.tty;
          group.conceptProperties.forEach(concept => {
            const medicine = {
              rxcui: concept.rxcui,
              name: concept.name,
              tty: concept.tty
            };
            
            if (type.includes('SBD') || type.includes('BPCK')) {
              related.branded.push(medicine);
            } else if (type.includes('SCD') || type.includes('GPCK')) {
              related.generic.push(medicine);
            } else {
              related.alternatives.push(medicine);
            }
          });
        }
      });
    }
    
    return related;
  } catch (error) {
    console.error('RxNorm related medicines error:', error);
    return { branded: [], generic: [], alternatives: [] };
  }
};

/**
 * Search medicines by ingredient/active substance
 * @param {string} ingredient - Active ingredient name
 * @returns {Promise<Array>} - Array of medicines containing the ingredient
 */
export const searchByIngredient = async (ingredient) => {
  try {
    // First, find the ingredient RXCUI
    const ingredientResponse = await fetch(
      `${RXNORM_API}/rxcui.json?name=${encodeURIComponent(ingredient)}&search=2`
    );
    const ingredientData = await ingredientResponse.json();
    
    if (!ingredientData.idGroup || !ingredientData.idGroup.rxnormId) {
      return [];
    }
    
    const ingredientRxcui = ingredientData.idGroup.rxnormId[0];
    
    // Get all drugs containing this ingredient
    const drugsResponse = await fetch(
      `${RXNORM_API}/rxcui/${ingredientRxcui}/related.json?tty=SBD+SCD`
    );
    const drugsData = await drugsResponse.json();
    
    const medicines = [];
    if (drugsData.relatedGroup && drugsData.relatedGroup.conceptGroup) {
      drugsData.relatedGroup.conceptGroup.forEach(group => {
        if (group.conceptProperties) {
          group.conceptProperties.forEach(concept => {
            medicines.push({
              rxcui: concept.rxcui,
              name: concept.name,
              tty: concept.tty
            });
          });
        }
      });
    }
    
    return medicines;
  } catch (error) {
    console.error('RxNorm ingredient search error:', error);
    return [];
  }
};

/**
 * Get drug interactions for a medicine
 * @param {string} rxcui - RxNorm Concept Unique Identifier
 * @returns {Promise<Array>} - Array of drug interactions
 */
export const getDrugInteractions = async (rxcui) => {
  try {
    const response = await fetch(
      `${RXNORM_API}/interaction/interaction.json?rxcui=${rxcui}&sources=DrugBank`
    );
    const data = await response.json();
    
    if (data.interactionTypeGroup && data.interactionTypeGroup[0]?.interactionType) {
      return data.interactionTypeGroup[0].interactionType[0]?.interactionPair || [];
    }
    
    return [];
  } catch (error) {
    console.error('RxNorm interactions error:', error);
    return [];
  }
};

/**
 * Combined search function - searches both local DB and external API
 * @param {string} searchTerm - Term to search (name, symptom, or disease)
 * @param {Function} localSearchFn - Function to search local database
 * @returns {Promise<Object>} - Combined results from local and external sources
 */
export const combinedMedicineSearch = async (searchTerm, localSearchFn) => {
  try {
    // Search local database
    const localResults = await localSearchFn(searchTerm);
    
    // Search external API (RxNorm)
    const externalResults = await searchMedicineByName(searchTerm);
    
    // Try approximate search if no exact matches
    let approximateResults = [];
    if (externalResults.length === 0) {
      approximateResults = await searchMedicineApproximate(searchTerm);
    }
    
    return {
      local: localResults || [],
      external: externalResults,
      approximate: approximateResults,
      total: (localResults?.length || 0) + externalResults.length + approximateResults.length
    };
  } catch (error) {
    console.error('Combined search error:', error);
    return {
      local: [],
      external: [],
      approximate: [],
      total: 0
    };
  }
};

/**
 * Search by symptom - maps symptoms to potential medicines
 * This uses the local database since RxNorm doesn't have direct symptom mapping
 * @param {string} symptom - Symptom to search for
 * @param {Function} localSearchFn - Function to search local database by symptom
 * @returns {Promise<Array>} - Array of medicines that may help with the symptom
 */
export const searchBySymptom = async (symptom, localSearchFn) => {
  try {
    // Use local database for symptom-to-medicine mapping
    const localResults = await localSearchFn(symptom);
    
    // For common symptoms, also try searching RxNorm with related drug classes
    const symptomToDrugClass = {
      'pain': 'analgesic',
      'fever': 'antipyretic',
      'headache': 'analgesic',
      'cough': 'antitussive',
      'cold': 'decongestant',
      'allergy': 'antihistamine',
      'anxiety': 'anxiolytic',
      'depression': 'antidepressant',
      'infection': 'antibiotic',
      'inflammation': 'anti-inflammatory'
    };
    
    const drugClass = symptomToDrugClass[symptom.toLowerCase()];
    let externalResults = [];
    
    if (drugClass) {
      externalResults = await searchMedicineByName(drugClass);
    }
    
    return {
      local: localResults || [],
      external: externalResults,
      total: (localResults?.length || 0) + externalResults.length
    };
  } catch (error) {
    console.error('Symptom search error:', error);
    return {
      local: [],
      external: [],
      total: 0
    };
  }
};

export default {
  searchMedicineByName,
  getMedicineDetails,
  searchMedicineApproximate,
  getRelatedMedicines,
  searchByIngredient,
  getDrugInteractions,
  combinedMedicineSearch,
  searchBySymptom
};