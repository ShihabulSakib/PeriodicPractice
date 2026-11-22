/* data.js  -  Periodic Table Practice (HSC / Engineering admission)
 *
 * ELEMENTS    : the 59 ESSENTIAL elements, full detail (these are the practice deck).
 * OTHER_CELLS : the remaining 59 elements as [Z, symbol, gridRow, gridCol] - used only to
 *               draw dimmed tiles so the Table screen looks like the complete 118-element table.
 *
 * MASS FIELDS
 *   atomicMass         : the EXAM value (what the quiz treats as correct).
 *   atomicMassPrecise  : IUPAC-style standard atomic weight, 2 decimals (also accepted when typing, +-0.15).
 *   massSource         : "user"    = taken as-is from Jishan's own collected HSC/admission list (27 elements)
 *                        "school"  = was "derived"; replaced by the HSC school value from
 *                                    hsc_physics_chemistry_constants.json (12 elements; tools/apply_school_masses.js)
 *                        "derived" = not in his list; exam value derived with the same rounding habits
 *                                    (integers for most, 1 decimal where textbooks use it) from IUPAC values.
 *                                    TODO(verify): check every "derived" value against the NCTB / admission table.
 *   massIsApprox       : true for Rn and Ac (no stable isotope; mass number of the longest-lived isotope).
 *
 * Grid: rows 1-7 main table, row 8 spacer, row 9 lanthanoids, row 10 actinoids. La/Ac/Th/U have
 * iupacGroup = null (f-series). In HSC mode La, Ac, Th count as d-block (hscBlock = "d").
 */
window.ELEMENTS = [
  {"atomicNumber": 1, "symbol": "H", "name": "Hydrogen", "alternateNames": [], "period": 1, "iupacGroup": 1, "classicalGroup": "IA", "block": "s", "hscBlock": "s", "category": "reactive-nonmetal", "gridRow": 1, "gridCol": 1, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "reactivity-series"], "atomicMass": 1, "atomicMassPrecise": 1.008, "massSource": "user"},
  {"atomicNumber": 2, "symbol": "He", "name": "Helium", "alternateNames": [], "period": 1, "iupacGroup": 18, "classicalGroup": "VIIIA", "block": "s", "hscBlock": "s", "category": "noble-gas", "gridRow": 1, "gridCol": 18, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group"], "atomicMass": 4, "atomicMassPrecise": 4.0, "massSource": "school"},
  {"atomicNumber": 3, "symbol": "Li", "name": "Lithium", "alternateNames": [], "period": 2, "iupacGroup": 1, "classicalGroup": "IA", "block": "s", "hscBlock": "s", "category": "alkali-metal", "gridRow": 2, "gridCol": 1, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "flame-test", "diagonal-relationship", "reactivity-series"], "atomicMass": 7, "atomicMassPrecise": 6.94, "massSource": "school"},
  {"atomicNumber": 4, "symbol": "Be", "name": "Beryllium", "alternateNames": [], "period": 2, "iupacGroup": 2, "classicalGroup": "IIA", "block": "s", "hscBlock": "s", "category": "alkaline-earth-metal", "gridRow": 2, "gridCol": 2, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "no-flame-color-group2", "diagonal-relationship"], "atomicMass": 9, "atomicMassPrecise": 9.01, "massSource": "school"},
  {"atomicNumber": 5, "symbol": "B", "name": "Boron", "alternateNames": [], "period": 2, "iupacGroup": 13, "classicalGroup": "IIIA", "block": "p", "hscBlock": "p", "category": "metalloid", "gridRow": 2, "gridCol": 13, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "diagonal-relationship"], "atomicMass": 11, "atomicMassPrecise": 10.81, "massSource": "school"},
  {"atomicNumber": 6, "symbol": "C", "name": "Carbon", "alternateNames": [], "period": 2, "iupacGroup": 14, "classicalGroup": "IVA", "block": "p", "hscBlock": "p", "category": "reactive-nonmetal", "gridRow": 2, "gridCol": 14, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group"], "atomicMass": 12, "atomicMassPrecise": 12.01, "massSource": "user"},
  {"atomicNumber": 7, "symbol": "N", "name": "Nitrogen", "alternateNames": [], "period": 2, "iupacGroup": 15, "classicalGroup": "VA", "block": "p", "hscBlock": "p", "category": "reactive-nonmetal", "gridRow": 2, "gridCol": 15, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "pnictogen"], "atomicMass": 14, "atomicMassPrecise": 14.01, "massSource": "user"},
  {"atomicNumber": 8, "symbol": "O", "name": "Oxygen", "alternateNames": [], "period": 2, "iupacGroup": 16, "classicalGroup": "VIA", "block": "p", "hscBlock": "p", "category": "reactive-nonmetal", "gridRow": 2, "gridCol": 16, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "chalcogen"], "atomicMass": 16, "atomicMassPrecise": 16.0, "massSource": "user"},
  {"atomicNumber": 9, "symbol": "F", "name": "Fluorine", "alternateNames": [], "period": 2, "iupacGroup": 17, "classicalGroup": "VIIA", "block": "p", "hscBlock": "p", "category": "halogen", "gridRow": 2, "gridCol": 17, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group"], "atomicMass": 19, "atomicMassPrecise": 19.0, "massSource": "school"},
  {"atomicNumber": 10, "symbol": "Ne", "name": "Neon", "alternateNames": [], "period": 2, "iupacGroup": 18, "classicalGroup": "VIIIA", "block": "p", "hscBlock": "p", "category": "noble-gas", "gridRow": 2, "gridCol": 18, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group"], "atomicMass": 20, "atomicMassPrecise": 20.18, "massSource": "school"},
  {"atomicNumber": 11, "symbol": "Na", "name": "Sodium", "alternateNames": ["Natrium"], "period": 3, "iupacGroup": 1, "classicalGroup": "IA", "block": "s", "hscBlock": "s", "category": "alkali-metal", "gridRow": 3, "gridCol": 1, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "flame-test", "reactivity-series"], "atomicMass": 23, "atomicMassPrecise": 22.99, "massSource": "user"},
  {"atomicNumber": 12, "symbol": "Mg", "name": "Magnesium", "alternateNames": [], "period": 3, "iupacGroup": 2, "classicalGroup": "IIA", "block": "s", "hscBlock": "s", "category": "alkaline-earth-metal", "gridRow": 3, "gridCol": 2, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "no-flame-color-group2", "diagonal-relationship", "reactivity-series"], "atomicMass": 24, "atomicMassPrecise": 24.31, "massSource": "user"},
  {"atomicNumber": 13, "symbol": "Al", "name": "Aluminium", "alternateNames": ["Aluminum"], "period": 3, "iupacGroup": 13, "classicalGroup": "IIIA", "block": "p", "hscBlock": "p", "category": "post-transition-metal", "gridRow": 3, "gridCol": 13, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "diagonal-relationship", "reactivity-series"], "atomicMass": 27, "atomicMassPrecise": 26.98, "massSource": "user"},
  {"atomicNumber": 14, "symbol": "Si", "name": "Silicon", "alternateNames": [], "period": 3, "iupacGroup": 14, "classicalGroup": "IVA", "block": "p", "hscBlock": "p", "category": "metalloid", "gridRow": 3, "gridCol": 14, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "diagonal-relationship"], "atomicMass": 28, "atomicMassPrecise": 28.09, "massSource": "school"},
  {"atomicNumber": 15, "symbol": "P", "name": "Phosphorus", "alternateNames": [], "period": 3, "iupacGroup": 15, "classicalGroup": "VA", "block": "p", "hscBlock": "p", "category": "reactive-nonmetal", "gridRow": 3, "gridCol": 15, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "pnictogen"], "atomicMass": 31, "atomicMassPrecise": 30.97, "massSource": "user"},
  {"atomicNumber": 16, "symbol": "S", "name": "Sulfur", "alternateNames": ["Sulphur"], "period": 3, "iupacGroup": 16, "classicalGroup": "VIA", "block": "p", "hscBlock": "p", "category": "reactive-nonmetal", "gridRow": 3, "gridCol": 16, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "chalcogen"], "atomicMass": 32, "atomicMassPrecise": 32.06, "massSource": "user"},
  {"atomicNumber": 17, "symbol": "Cl", "name": "Chlorine", "alternateNames": [], "period": 3, "iupacGroup": 17, "classicalGroup": "VIIA", "block": "p", "hscBlock": "p", "category": "halogen", "gridRow": 3, "gridCol": 17, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group"], "atomicMass": 35.5, "atomicMassPrecise": 35.45, "massSource": "user"},
  {"atomicNumber": 18, "symbol": "Ar", "name": "Argon", "alternateNames": [], "period": 3, "iupacGroup": 18, "classicalGroup": "VIIIA", "block": "p", "hscBlock": "p", "category": "noble-gas", "gridRow": 3, "gridCol": 18, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group"], "atomicMass": 40, "atomicMassPrecise": 39.95, "massSource": "school"},
  {"atomicNumber": 19, "symbol": "K", "name": "Potassium", "alternateNames": ["Kalium"], "period": 4, "iupacGroup": 1, "classicalGroup": "IA", "block": "s", "hscBlock": "s", "category": "alkali-metal", "gridRow": 4, "gridCol": 1, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "flame-test", "reactivity-series"], "atomicMass": 39.1, "atomicMassPrecise": 39.1, "massSource": "user"},
  {"atomicNumber": 20, "symbol": "Ca", "name": "Calcium", "alternateNames": [], "period": 4, "iupacGroup": 2, "classicalGroup": "IIA", "block": "s", "hscBlock": "s", "category": "alkaline-earth-metal", "gridRow": 4, "gridCol": 2, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "flame-test", "reactivity-series"], "atomicMass": 40, "atomicMassPrecise": 40.08, "massSource": "user"},
  {"atomicNumber": 21, "symbol": "Sc", "name": "Scandium", "alternateNames": [], "period": 4, "iupacGroup": 3, "classicalGroup": "IIIB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 4, "gridCol": 3, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "3d-series", "non-transition-d-block"], "atomicMass": 45, "atomicMassPrecise": 44.96, "massSource": "derived"},
  {"atomicNumber": 22, "symbol": "Ti", "name": "Titanium", "alternateNames": [], "period": 4, "iupacGroup": 4, "classicalGroup": "IVB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 4, "gridCol": 4, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "3d-series"], "atomicMass": 48, "atomicMassPrecise": 47.87, "massSource": "derived"},
  {"atomicNumber": 23, "symbol": "V", "name": "Vanadium", "alternateNames": [], "period": 4, "iupacGroup": 5, "classicalGroup": "VB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 4, "gridCol": 5, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "3d-series"], "atomicMass": 51, "atomicMassPrecise": 50.94, "massSource": "derived"},
  {"atomicNumber": 24, "symbol": "Cr", "name": "Chromium", "alternateNames": [], "period": 4, "iupacGroup": 6, "classicalGroup": "VIB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 4, "gridCol": 6, "admissionTier": "essential", "isAufbauException": true, "examTags": ["period-1-4", "3d-series", "aufbau-exception", "hsc-toxic-heavy-metal"], "atomicMass": 52, "atomicMassPrecise": 52.0, "massSource": "user"},
  {"atomicNumber": 25, "symbol": "Mn", "name": "Manganese", "alternateNames": [], "period": 4, "iupacGroup": 7, "classicalGroup": "VIIB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 4, "gridCol": 7, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "3d-series"], "atomicMass": 54.93, "atomicMassPrecise": 54.94, "massSource": "user"},
  {"atomicNumber": 26, "symbol": "Fe", "name": "Iron", "alternateNames": ["Ferrum"], "period": 4, "iupacGroup": 8, "classicalGroup": "VIIIB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 4, "gridCol": 8, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "3d-series", "reactivity-series"], "atomicMass": 55.85, "atomicMassPrecise": 55.85, "massSource": "user"},
  {"atomicNumber": 27, "symbol": "Co", "name": "Cobalt", "alternateNames": [], "period": 4, "iupacGroup": 9, "classicalGroup": "VIIIB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 4, "gridCol": 9, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "3d-series"], "atomicMass": 59, "atomicMassPrecise": 58.93, "massSource": "user"},
  {"atomicNumber": 28, "symbol": "Ni", "name": "Nickel", "alternateNames": [], "period": 4, "iupacGroup": 10, "classicalGroup": "VIIIB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 4, "gridCol": 10, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "3d-series", "reactivity-series"], "atomicMass": 58.7, "atomicMassPrecise": 58.69, "massSource": "user"},
  {"atomicNumber": 29, "symbol": "Cu", "name": "Copper", "alternateNames": ["Cuprum"], "period": 4, "iupacGroup": 11, "classicalGroup": "IB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 4, "gridCol": 11, "admissionTier": "essential", "isAufbauException": true, "examTags": ["period-1-4", "3d-series", "aufbau-exception", "flame-test", "coinage-metal", "reactivity-series"], "atomicMass": 63.5, "atomicMassPrecise": 63.55, "massSource": "user"},
  {"atomicNumber": 30, "symbol": "Zn", "name": "Zinc", "alternateNames": [], "period": 4, "iupacGroup": 12, "classicalGroup": "IIB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 4, "gridCol": 12, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "3d-series", "non-transition-d-block", "reactivity-series"], "atomicMass": 65.4, "atomicMassPrecise": 65.38, "massSource": "user"},
  {"atomicNumber": 31, "symbol": "Ga", "name": "Gallium", "alternateNames": [], "period": 4, "iupacGroup": 13, "classicalGroup": "IIIA", "block": "p", "hscBlock": "p", "category": "post-transition-metal", "gridRow": 4, "gridCol": 13, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group"], "atomicMass": 69.7, "atomicMassPrecise": 69.72, "massSource": "derived"},
  {"atomicNumber": 32, "symbol": "Ge", "name": "Germanium", "alternateNames": [], "period": 4, "iupacGroup": 14, "classicalGroup": "IVA", "block": "p", "hscBlock": "p", "category": "metalloid", "gridRow": 4, "gridCol": 14, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group"], "atomicMass": 72.6, "atomicMassPrecise": 72.63, "massSource": "derived"},
  {"atomicNumber": 33, "symbol": "As", "name": "Arsenic", "alternateNames": [], "period": 4, "iupacGroup": 15, "classicalGroup": "VA", "block": "p", "hscBlock": "p", "category": "metalloid", "gridRow": 4, "gridCol": 15, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "pnictogen", "hsc-toxic-heavy-metal"], "atomicMass": 74.9, "atomicMassPrecise": 74.92, "massSource": "user"},
  {"atomicNumber": 34, "symbol": "Se", "name": "Selenium", "alternateNames": [], "period": 4, "iupacGroup": 16, "classicalGroup": "VIA", "block": "p", "hscBlock": "p", "category": "reactive-nonmetal", "gridRow": 4, "gridCol": 16, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "chalcogen"], "atomicMass": 79, "atomicMassPrecise": 78.97, "massSource": "school"},
  {"atomicNumber": 35, "symbol": "Br", "name": "Bromine", "alternateNames": [], "period": 4, "iupacGroup": 17, "classicalGroup": "VIIA", "block": "p", "hscBlock": "p", "category": "halogen", "gridRow": 4, "gridCol": 17, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group", "liquid-at-rt"], "atomicMass": 80, "atomicMassPrecise": 79.9, "massSource": "user"},
  {"atomicNumber": 36, "symbol": "Kr", "name": "Krypton", "alternateNames": [], "period": 4, "iupacGroup": 18, "classicalGroup": "VIIIA", "block": "p", "hscBlock": "p", "category": "noble-gas", "gridRow": 4, "gridCol": 18, "admissionTier": "essential", "isAufbauException": false, "examTags": ["period-1-4", "main-group"], "atomicMass": 84, "atomicMassPrecise": 83.8, "massSource": "derived"},
  {"atomicNumber": 37, "symbol": "Rb", "name": "Rubidium", "alternateNames": [], "period": 5, "iupacGroup": 1, "classicalGroup": "IA", "block": "s", "hscBlock": "s", "category": "alkali-metal", "gridRow": 5, "gridCol": 1, "admissionTier": "essential", "isAufbauException": false, "examTags": ["main-group", "flame-test"], "atomicMass": 85.5, "atomicMassPrecise": 85.47, "massSource": "derived"},
  {"atomicNumber": 38, "symbol": "Sr", "name": "Strontium", "alternateNames": [], "period": 5, "iupacGroup": 2, "classicalGroup": "IIA", "block": "s", "hscBlock": "s", "category": "alkaline-earth-metal", "gridRow": 5, "gridCol": 2, "admissionTier": "essential", "isAufbauException": false, "examTags": ["main-group", "flame-test"], "atomicMass": 87.6, "atomicMassPrecise": 87.62, "massSource": "derived"},
  {"atomicNumber": 42, "symbol": "Mo", "name": "Molybdenum", "alternateNames": [], "period": 5, "iupacGroup": 6, "classicalGroup": "VIB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 5, "gridCol": 6, "admissionTier": "essential", "isAufbauException": true, "examTags": ["aufbau-exception"], "atomicMass": 96, "atomicMassPrecise": 95.95, "massSource": "derived"},
  {"atomicNumber": 46, "symbol": "Pd", "name": "Palladium", "alternateNames": [], "period": 5, "iupacGroup": 10, "classicalGroup": "VIIIB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 5, "gridCol": 10, "admissionTier": "essential", "isAufbauException": true, "examTags": ["aufbau-exception"], "atomicMass": 106.4, "atomicMassPrecise": 106.42, "massSource": "derived"},
  {"atomicNumber": 47, "symbol": "Ag", "name": "Silver", "alternateNames": ["Argentum"], "period": 5, "iupacGroup": 11, "classicalGroup": "IB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 5, "gridCol": 11, "admissionTier": "essential", "isAufbauException": true, "examTags": ["aufbau-exception", "coinage-metal", "reactivity-series"], "atomicMass": 108, "atomicMassPrecise": 107.87, "massSource": "user"},
  {"atomicNumber": 48, "symbol": "Cd", "name": "Cadmium", "alternateNames": [], "period": 5, "iupacGroup": 12, "classicalGroup": "IIB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 5, "gridCol": 12, "admissionTier": "essential", "isAufbauException": false, "examTags": ["non-transition-d-block", "hsc-toxic-heavy-metal"], "atomicMass": 112.4, "atomicMassPrecise": 112.41, "massSource": "derived"},
  {"atomicNumber": 50, "symbol": "Sn", "name": "Tin", "alternateNames": ["Stannum"], "period": 5, "iupacGroup": 14, "classicalGroup": "IVA", "block": "p", "hscBlock": "p", "category": "post-transition-metal", "gridRow": 5, "gridCol": 14, "admissionTier": "essential", "isAufbauException": false, "examTags": ["main-group", "reactivity-series", "inert-pair-effect"], "atomicMass": 119, "atomicMassPrecise": 118.71, "massSource": "school"},
  {"atomicNumber": 51, "symbol": "Sb", "name": "Antimony", "alternateNames": ["Stibium"], "period": 5, "iupacGroup": 15, "classicalGroup": "VA", "block": "p", "hscBlock": "p", "category": "metalloid", "gridRow": 5, "gridCol": 15, "admissionTier": "essential", "isAufbauException": false, "examTags": ["main-group", "pnictogen", "inert-pair-effect"], "atomicMass": 121.8, "atomicMassPrecise": 121.76, "massSource": "derived"},
  {"atomicNumber": 52, "symbol": "Te", "name": "Tellurium", "alternateNames": [], "period": 5, "iupacGroup": 16, "classicalGroup": "VIA", "block": "p", "hscBlock": "p", "category": "metalloid", "gridRow": 5, "gridCol": 16, "admissionTier": "essential", "isAufbauException": false, "examTags": ["main-group", "chalcogen"], "atomicMass": 127.6, "atomicMassPrecise": 127.6, "massSource": "derived"},
  {"atomicNumber": 53, "symbol": "I", "name": "Iodine", "alternateNames": [], "period": 5, "iupacGroup": 17, "classicalGroup": "VIIA", "block": "p", "hscBlock": "p", "category": "halogen", "gridRow": 5, "gridCol": 17, "admissionTier": "essential", "isAufbauException": false, "examTags": ["main-group"], "atomicMass": 127, "atomicMassPrecise": 126.9, "massSource": "user"},
  {"atomicNumber": 54, "symbol": "Xe", "name": "Xenon", "alternateNames": [], "period": 5, "iupacGroup": 18, "classicalGroup": "VIIIA", "block": "p", "hscBlock": "p", "category": "noble-gas", "gridRow": 5, "gridCol": 18, "admissionTier": "essential", "isAufbauException": false, "examTags": ["main-group"], "atomicMass": 131.3, "atomicMassPrecise": 131.29, "massSource": "derived"},
  {"atomicNumber": 55, "symbol": "Cs", "name": "Caesium", "alternateNames": ["Cesium"], "period": 6, "iupacGroup": 1, "classicalGroup": "IA", "block": "s", "hscBlock": "s", "category": "alkali-metal", "gridRow": 6, "gridCol": 1, "admissionTier": "essential", "isAufbauException": false, "examTags": ["main-group", "flame-test"], "atomicMass": 133, "atomicMassPrecise": 132.91, "massSource": "derived"},
  {"atomicNumber": 56, "symbol": "Ba", "name": "Barium", "alternateNames": [], "period": 6, "iupacGroup": 2, "classicalGroup": "IIA", "block": "s", "hscBlock": "s", "category": "alkaline-earth-metal", "gridRow": 6, "gridCol": 2, "admissionTier": "essential", "isAufbauException": false, "examTags": ["main-group", "flame-test", "reactivity-series"], "atomicMass": 137, "atomicMassPrecise": 137.33, "massSource": "user"},
  {"atomicNumber": 57, "symbol": "La", "name": "Lanthanum", "alternateNames": [], "period": 6, "iupacGroup": null, "classicalGroup": null, "block": "f", "hscBlock": "d", "category": "lanthanoid", "gridRow": 9, "gridCol": 4, "admissionTier": "essential", "isAufbauException": true, "examTags": ["aufbau-exception", "hsc-d-block-41-rule"], "atomicMass": 139, "atomicMassPrecise": 138.91, "massSource": "derived"},
  {"atomicNumber": 78, "symbol": "Pt", "name": "Platinum", "alternateNames": [], "period": 6, "iupacGroup": 10, "classicalGroup": "VIIIB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 6, "gridCol": 10, "admissionTier": "essential", "isAufbauException": true, "examTags": ["aufbau-exception", "reactivity-series"], "atomicMass": 195, "atomicMassPrecise": 195.08, "massSource": "school"},
  {"atomicNumber": 79, "symbol": "Au", "name": "Gold", "alternateNames": ["Aurum"], "period": 6, "iupacGroup": 11, "classicalGroup": "IB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 6, "gridCol": 11, "admissionTier": "essential", "isAufbauException": true, "examTags": ["aufbau-exception", "coinage-metal", "reactivity-series"], "atomicMass": 197, "atomicMassPrecise": 196.97, "massSource": "user"},
  {"atomicNumber": 80, "symbol": "Hg", "name": "Mercury", "alternateNames": ["Hydrargyrum", "Quicksilver"], "period": 6, "iupacGroup": 12, "classicalGroup": "IIB", "block": "d", "hscBlock": "d", "category": "transition-metal", "gridRow": 6, "gridCol": 12, "admissionTier": "essential", "isAufbauException": false, "examTags": ["non-transition-d-block", "hsc-toxic-heavy-metal", "reactivity-series", "liquid-at-rt"], "atomicMass": 200.5, "atomicMassPrecise": 200.59, "massSource": "user"},
  {"atomicNumber": 82, "symbol": "Pb", "name": "Lead", "alternateNames": ["Plumbum"], "period": 6, "iupacGroup": 14, "classicalGroup": "IVA", "block": "p", "hscBlock": "p", "category": "post-transition-metal", "gridRow": 6, "gridCol": 14, "admissionTier": "essential", "isAufbauException": false, "examTags": ["main-group", "hsc-toxic-heavy-metal", "reactivity-series", "inert-pair-effect"], "atomicMass": 207, "atomicMassPrecise": 207.2, "massSource": "user"},
  {"atomicNumber": 83, "symbol": "Bi", "name": "Bismuth", "alternateNames": [], "period": 6, "iupacGroup": 15, "classicalGroup": "VA", "block": "p", "hscBlock": "p", "category": "post-transition-metal", "gridRow": 6, "gridCol": 15, "admissionTier": "essential", "isAufbauException": false, "examTags": ["main-group", "pnictogen", "inert-pair-effect"], "atomicMass": 209, "atomicMassPrecise": 208.98, "massSource": "derived"},
  {"atomicNumber": 86, "symbol": "Rn", "name": "Radon", "alternateNames": [], "period": 6, "iupacGroup": 18, "classicalGroup": "VIIIA", "block": "p", "hscBlock": "p", "category": "noble-gas", "gridRow": 6, "gridCol": 18, "admissionTier": "essential", "isAufbauException": false, "examTags": ["main-group"], "atomicMass": 222, "atomicMassPrecise": 222, "massSource": "derived", "massIsApprox": true},
  {"atomicNumber": 89, "symbol": "Ac", "name": "Actinium", "alternateNames": [], "period": 7, "iupacGroup": null, "classicalGroup": null, "block": "f", "hscBlock": "d", "category": "actinoid", "gridRow": 10, "gridCol": 4, "admissionTier": "essential", "isAufbauException": true, "examTags": ["aufbau-exception", "hsc-d-block-41-rule"], "atomicMass": 227, "atomicMassPrecise": 227, "massSource": "derived", "massIsApprox": true},
  {"atomicNumber": 90, "symbol": "Th", "name": "Thorium", "alternateNames": [], "period": 7, "iupacGroup": null, "classicalGroup": null, "block": "f", "hscBlock": "d", "category": "actinoid", "gridRow": 10, "gridCol": 5, "admissionTier": "essential", "isAufbauException": true, "examTags": ["aufbau-exception", "hsc-d-block-41-rule"], "atomicMass": 232, "atomicMassPrecise": 232.04, "massSource": "derived"},
  {"atomicNumber": 92, "symbol": "U", "name": "Uranium", "alternateNames": [], "period": 7, "iupacGroup": null, "classicalGroup": null, "block": "f", "hscBlock": "f", "category": "actinoid", "gridRow": 10, "gridCol": 7, "admissionTier": "essential", "isAufbauException": true, "examTags": ["aufbau-exception"], "atomicMass": 238, "atomicMassPrecise": 238.03, "massSource": "school"}
];

window.OTHER_CELLS = [
  [39, "Y", 5, 3],
  [40, "Zr", 5, 4],
  [41, "Nb", 5, 5],
  [43, "Tc", 5, 7],
  [44, "Ru", 5, 8],
  [45, "Rh", 5, 9],
  [49, "In", 5, 13],
  [58, "Ce", 9, 5],
  [59, "Pr", 9, 6],
  [60, "Nd", 9, 7],
  [61, "Pm", 9, 8],
  [62, "Sm", 9, 9],
  [63, "Eu", 9, 10],
  [64, "Gd", 9, 11],
  [65, "Tb", 9, 12],
  [66, "Dy", 9, 13],
  [67, "Ho", 9, 14],
  [68, "Er", 9, 15],
  [69, "Tm", 9, 16],
  [70, "Yb", 9, 17],
  [71, "Lu", 9, 18],
  [72, "Hf", 6, 4],
  [73, "Ta", 6, 5],
  [74, "W", 6, 6],
  [75, "Re", 6, 7],
  [76, "Os", 6, 8],
  [77, "Ir", 6, 9],
  [81, "Tl", 6, 13],
  [84, "Po", 6, 16],
  [85, "At", 6, 17],
  [87, "Fr", 7, 1],
  [88, "Ra", 7, 2],
  [91, "Pa", 10, 6],
  [93, "Np", 10, 8],
  [94, "Pu", 10, 9],
  [95, "Am", 10, 10],
  [96, "Cm", 10, 11],
  [97, "Bk", 10, 12],
  [98, "Cf", 10, 13],
  [99, "Es", 10, 14],
  [100, "Fm", 10, 15],
  [101, "Md", 10, 16],
  [102, "No", 10, 17],
  [103, "Lr", 10, 18],
  [104, "Rf", 7, 4],
  [105, "Db", 7, 5],
  [106, "Sg", 7, 6],
  [107, "Bh", 7, 7],
  [108, "Hs", 7, 8],
  [109, "Mt", 7, 9],
  [110, "Ds", 7, 10],
  [111, "Rg", 7, 11],
  [112, "Cn", 7, 12],
  [113, "Nh", 7, 13],
  [114, "Fl", 7, 14],
  [115, "Mc", 7, 15],
  [116, "Lv", 7, 16],
  [117, "Ts", 7, 17],
  [118, "Og", 7, 18]
];

window.TABLE_META = {
  "schemaVersion": "1.1.0",
  "standard": "IUPAC Periodic Table (4 May 2022) + Bangladesh HSC conventions",
  "gridColumns": 18,
  "gridRows": 10,
  "spacerRow": 8,
  "seriesPlaceholders": [
    {
      "gridRow": 6,
      "gridCol": 3,
      "label": "57-71"
    },
    {
      "gridRow": 7,
      "gridCol": 3,
      "label": "89-103"
    }
  ],
  "deck": "essential",
  "essentialCount": 59,
  "userMassCount": 27,
  "schoolMassCount": 12,
  "derivedMassCount": 20
};
