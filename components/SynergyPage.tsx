import React from 'react';
import { SynergyPair } from '../types';
import { SynergyPod } from './SynergyPod';

interface SynergyPageProps {
  synergyPairs: SynergyPair[];
}

export const SynergyPage: React.FC<SynergyPageProps> = ({ synergyPairs }) => {
  return (
    <div className="animate-fadeIn">
       <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold text-purple-900 mb-2">AI Study Pods</h2>
          <p className="text-purple-700 max-w-2xl mx-auto">
            Our algorithm analyzes student strengths to create optimal study pairs. 
            Students with >80% in a subject help those with lower scores, maximizing the class potential.
          </p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {synergyPairs.map((pair, idx) => (
            <SynergyPod key={idx} pair={pair} />
          ))}
       </div>
    </div>
  );
};