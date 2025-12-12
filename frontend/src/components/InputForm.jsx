import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { stateDistrictData } from '../data/locations';
import rainfallDataFile from '../data/rainfall_data.json';
import groundwaterDataFile from '../data/groundwater_data.json';

const SEASONAL_CROPS = {
  "Kharif (Monsoon)": [
    { value: "Rice", label: "Rice (High Water)" },
    { value: "Cotton", label: "Cotton (Dry)" },
    { value: "Maize", label: "Example: Maize (Moderate)" },
    { value: "Sugarcane", label: "Sugarcane (High Water)" },
    // Millets
    { value: "Jowar", label: "Jowar (Sorghum) (Dry)" },
    { value: "Bajra", label: "Bajra (Pearl Millet) (Dry)" },
    { value: "Ragi", label: "Ragi (Finger Millet) (Dry)" },
    // Fruits & Others
    { value: "Banana", label: "Banana (High Water)" },
    { value: "Soybean", label: "Soybean (Moderate)" },
    { value: "Groundnut", label: "Groundnut (Dry)" }
  ],
  "Rabi (Winter)": [
    { value: "Wheat", label: "Wheat (Moderate)" },
    { value: "Pulses", label: "Pulses (Dry)" },
    { value: "Mustard", label: "Mustard (Dry)" },
    { value: "Barley", label: "Barley (Dry)" },
    // Veggies & Fruits
    { value: "Potato", label: "Potato (Moderate)" },
    { value: "Tomato", label: "Tomato (Moderate)" },
    { value: "Onion", label: "Onion (Moderate)" },
    { value: "Orange", label: "Orange/Kinnow (Moderate)" }
  ],
  "Zaid (Summer)": [
    { value: "Watermelon", label: "Watermelon (Moderate)" },
    { value: "Muskmelon", label: "Muskmelon (Moderate)" },
    { value: "Cucumber", label: "Cucumber (High Water)" },
    { value: "Pumpkin", label: "Pumpkin (Moderate)" },
    { value: "Bitter Gourd", label: "Bitter Gourd (Moderate)" },
    { value: "Okra", label: "Okra (Bhindi) (Moderate)" }
  ]
};

export default function InputForm({ onPredict, loading, demoData }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    rainfall: '',
    groundwater: '',
    crop_history: 'Rice'
  });

  // Effect to populate form when demoData changes
  useEffect(() => {
    if (demoData) {
      setFormData(prev => ({
        ...prev,
        ...demoData
      }));
      // trigger district update if needed (simplified for demo)
      if (demoData.state) {
        const districtList = stateDistrictData[demoData.state] ? stateDistrictData[demoData.state].sort() : [];
        setDistricts(districtList);
      }
    }
  }, [demoData]);

  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedSeason, setSelectedSeason] = useState('Kharif (Monsoon)');

  const [districts, setDistricts] = useState([]);

  // Sort states alphabetically
  const sortedStates = Object.keys(stateDistrictData).sort();

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const districtList = stateDistrictData[newState] ? stateDistrictData[newState].sort() : [];

    setFormData(prev => ({
      ...prev,
      state: newState,
      district: '' // Reset district when state changes
    }));
    setDistricts(districtList);

    // Auto-populate rainfall and groundwater
    updateRainfall(newState, selectedYear);
    updateGroundwater(newState, selectedYear);
  };

  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    if (formData.state) {
      updateRainfall(formData.state, newYear);
      updateGroundwater(formData.state, newYear);
    }
  };

  const updateRainfall = (state, year) => {
    let stateKey = state;
    // Handle name mismatches
    if (state === "Andaman and Nicobar Islands") stateKey = "Andaman & Nicobar Islands";
    if (state === "Jammu and Kashmir") stateKey = "Jammu & Kashmir";
    if (state === "Dadra and Nagar Haveli and Daman and Diu") stateKey = "Daman & Diu and Dadra & Nagar Haveli";

    const data = rainfallDataFile.rainfall_data[year];
    if (data && data[stateKey]) {
      setFormData(prev => ({
        ...prev,
        rainfall: data[stateKey]
      }));
    }
  };

  const updateGroundwater = (state, year) => {
    let stateKey = state;
    // Handle name mismatches
    if (state === "Dadra and Nagar Haveli and Daman and Diu") stateKey = "Dadra & Nagar Haveli and Daman & Diu";
    if (state === "Andaman and Nicobar Islands") stateKey = "Andaman & Nicobar Islands";
    if (state === "Jammu and Kashmir") stateKey = "Jammu & Kashmir";

    const data = groundwaterDataFile.groundwater_recharge_bcm[year];
    if (data && data[stateKey]) {
      setFormData(prev => ({
        ...prev,
        groundwater: data[stateKey]
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSeasonChange = (e) => {
    const newSeason = e.target.value;
    setSelectedSeason(newSeason);
    // Reset crop to first option of new season
    const firstCrop = SEASONAL_CROPS[newSeason][0].value;
    setFormData(prev => ({
      ...prev,
      crop_history: firstCrop
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict({
      ...formData,
      rainfall: parseFloat(formData.rainfall),
      groundwater: parseFloat(formData.groundwater)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl space-y-8 text-gray-100 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-nature-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-2xl">🌱</span> {t('inputTitle')}
        </h2>
        <p className="text-white/60 text-sm mb-6">{t('enterCredentials')}</p>

        <div className="space-y-6">
          {/* Location Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group space-y-2">
              <label className="text-xs font-bold text-nature-400 uppercase tracking-wider flex items-center gap-1">
                Location Info
              </label>
              <div className="relative">
                <select
                  name="state"
                  required
                  className="input-field w-full p-4 pl-12 rounded-2xl bg-black/20 focus:bg-black/40 border border-white/10 focus:border-nature-500 transition-all outline-none appearance-none cursor-pointer"
                  value={formData.state}
                  onChange={handleStateChange}
                >
                  <option value="" disabled className="text-gray-500">Select State</option>
                  {sortedStates.map(state => (
                    <option key={state} value={state} className="text-gray-900">{state}</option>
                  ))}
                </select>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">🗺️</span>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-white">▼</div>
              </div>
            </div>

            <div className="group space-y-2 pt-6"> {/* Pt-6 to align with label if single line, or remove pt if grid aligns */}
              <div className="relative">
                <select
                  name="district"
                  required
                  className="input-field w-full p-4 pl-12 rounded-2xl bg-black/20 focus:bg-black/40 border border-white/10 focus:border-nature-500 transition-all outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.state}
                >
                  <option value="" disabled className="text-gray-500">
                    {formData.state ? "Select District" : "Select State First"}
                  </option>
                  {districts.map(dist => (
                    <option key={dist} value={dist} className="text-gray-900">{dist}</option>
                  ))}
                </select>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">📍</span>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-white">▼</div>
              </div>
            </div>
          </div>

          {/* Environmental Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                  Water Levels
                </label>
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="bg-black/20 text-blue-300 text-xs rounded-lg px-2 py-1 border border-blue-500/30 focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="2025">2025 Data</option>
                  <option value="2024">2024 Data</option>
                  <option value="2023">2023 Data</option>
                </select>
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="rainfall"
                  required
                  min="0"
                  className="input-field w-full p-4 pl-12 rounded-2xl bg-black/20 focus:bg-black/40 border border-white/10 focus:border-blue-500 transition-all outline-none"
                  placeholder="Rainfall (mm)"
                  value={formData.rainfall}
                  onChange={handleChange}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">🌧️</span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30">mm/yr</span>
              </div>
            </div>

            <div className="relative group pt-6">
              <div className="relative">
                <input
                  type="number"
                  name="groundwater"
                  required
                  min="0"
                  className="input-field w-full p-4 pl-12 rounded-2xl bg-black/20 focus:bg-black/40 border border-white/10 focus:border-blue-500 transition-all outline-none"
                  placeholder="Ground Water (BCM)"
                  value={formData.groundwater}
                  onChange={handleChange}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">💧</span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30">BCM</span>
              </div>
            </div>
          </div>

          {/* Crop History & Season */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group space-y-2">
              <label className="text-xs font-bold text-yellow-400 uppercase tracking-wider block">
                Season
              </label>
              <div className="relative">
                <select
                  value={selectedSeason}
                  onChange={handleSeasonChange}
                  className="input-field w-full p-4 pl-12 rounded-2xl bg-black/20 focus:bg-black/40 border border-white/10 focus:border-yellow-500 transition-all outline-none appearance-none cursor-pointer text-white"
                >
                  {Object.keys(SEASONAL_CROPS).map(season => (
                    <option key={season} value={season} className="text-gray-900">{season}</option>
                  ))}
                </select>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">🌞</span>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-xs font-bold text-yellow-400 uppercase tracking-wider block">
                Selected Crop
              </label>
              <div className="relative">
                <select
                  name="crop_history"
                  className="input-field w-full p-4 pl-12 rounded-2xl bg-black/20 focus:bg-black/40 border border-white/10 focus:border-yellow-500 transition-all outline-none appearance-none cursor-pointer text-white"
                  value={formData.crop_history}
                  onChange={handleChange}
                >
                  {SEASONAL_CROPS[selectedSeason].map(crop => (
                    <option key={crop.value} value={crop.value} className="text-gray-900">{crop.label}</option>
                  ))}
                </select>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">🌾</span>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-gradient-to-r from-nature-600 to-nature-500 hover:from-nature-500 hover:to-nature-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-nature-900/50 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">⏳</span> {t('predicting')}
            </>
          ) : (
            <>
              <span className="text-xl">🚀</span> {t('predictButton')}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
