import React from 'react'
import { X } from 'lucide-react'

const POPULAR_SKILLS = [
  'React', 'Python', 'Java', 'UI/UX', 'Machine Learning',
  'Node.js', 'Flutter', 'Data Analysis', 'Spring Boot', 'Firebase',
  'MongoDB', 'AWS', 'TypeScript', 'Figma', 'SQL'
]

export default function SkillFilter({ selectedSkill, onSkillSelect }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-700">Filter by Skill</p>
        {selectedSkill && (
          <button
            onClick={() => onSkillSelect(null)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700
                       bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {POPULAR_SKILLS.map(skill => (
          <button
            key={skill}
            onClick={() => onSkillSelect(selectedSkill === skill ? null : skill)}
            className={`
              px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-150
              ${selectedSkill === skill
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }
            `}
          >
            {skill}
          </button>
        ))}
      </div>
    </div>
  )
}
