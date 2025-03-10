import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../../store/questionSlice';
import Button from './Button';

const FilterPanel = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.questions);
  
  const handleLevelChange = (level) => {
    dispatch(setFilters({ level: level === filters.level ? null : level }));
  };
  
  const handleTypeChange = (e) => {
    const type = e.target.value === 'all' ? null : e.target.value;
    dispatch(setFilters({ type }));
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  return (
    <div className="bg-secondary rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold text-text mb-4">Filter Questions</h2>
      
      <div className="space-y-4">
        {/* Difficulty Level Filter */}
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-2">Difficulty Level</h3>
          <div className="flex space-x-2">
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                className={`px-3 py-1 rounded-md text-sm ${
                  filters.level === level
                    ? 'bg-accent text-white'
                    : 'bg-primary text-text hover:bg-gray-800'
                }`}
                onClick={() => handleLevelChange(level)}
              >
                Level {level}
              </button>
            ))}
          </div>
        </div>
        
        {/* Question Type Filter */}
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-2">Question Type</h3>
          <select
            className="w-full bg-primary border border-gray-700 rounded-md px-3 py-2 text-text focus:outline-none focus:ring-1 focus:ring-accent"
            value={filters.type || 'all'}
            onChange={handleTypeChange}
          >
            <option value="all">All Types</option>
            <option value="singleCorrect">Single Correct</option>
            <option value="multipleCorrect">Multiple Correct</option>
            <option value="numerical">Numerical</option>
            <option value="subjective">Subjective</option>
          </select>
        </div>
        
        {/* Clear Filters Button */}
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            fullWidth
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 