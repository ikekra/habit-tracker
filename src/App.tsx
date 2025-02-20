import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Trophy, Calendar, Trash2 } from 'lucide-react';
interface Habit {
  id: string;
  name: string;
  dates: Record<string, boolean>;
  createdAt: string;
}
function App() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    
    setHabits([
      ...habits,
      {
        id: crypto.randomUUID(),
        name: newHabit,
        dates: {},
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewHabit('');
  };

  const toggleHabit = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          dates: {
            ...habit.dates,
            [date]: !habit.dates[date],
          },
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const getStreak = (dates: Record<string, boolean>) => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (dates[dateStr]) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getLast7Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const last7Days = getLast7Days();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-8 h-8 text-purple-600" />
            Habit Tracker
          </h1>

          <form onSubmit={addHabit} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Enter a new habit..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Habit
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {habits.map(habit => (
              <div key={habit.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {getStreak(habit.dates)} day streak
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {last7Days.map(date => (
                    <div key={date} className="text-center">
                      <div className="text-xs text-gray-600 mb-1">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <button
                        onClick={() => toggleHabit(habit.id, date)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          habit.dates[date]
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                        }`}
                      >
                        {habit.dates[date] ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          
          {habits.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No habits added yet. Start by adding a new habit above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;
