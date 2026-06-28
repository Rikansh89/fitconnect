const WEIGHTS = {
  fitnessGoal: 0.4,
  workoutTime: 0.3,
  experienceLevel: 0.2,
  city: 0.1,
};

function calculateCompatibility(user1, user2) {
  const breakdown = {
    fitnessGoal: user1.fitnessGoal && user1.fitnessGoal === user2.fitnessGoal ? WEIGHTS.fitnessGoal * 100 : 0,
    workoutTime: user1.preferredWorkoutTime && user1.preferredWorkoutTime === user2.preferredWorkoutTime ? WEIGHTS.workoutTime * 100 : 0,
    experienceLevel: user1.experienceLevel && user1.experienceLevel === user2.experienceLevel ? WEIGHTS.experienceLevel * 100 : 0,
    city: user1.city && user1.city.toLowerCase() === (user2.city || '').toLowerCase() ? WEIGHTS.city * 100 : 0,
  };

  const totalScore = Math.round(
    breakdown.fitnessGoal + breakdown.workoutTime + breakdown.experienceLevel + breakdown.city
  );

  return { totalScore, breakdown };
}

function findMatches(currentUser, users) {
  return users
    .filter((u) => u._id.toString() !== currentUser._id.toString())
    .map((user) => {
      const { totalScore, breakdown } = calculateCompatibility(currentUser, user);
      return { user, compatibilityScore: totalScore, breakdown };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

module.exports = { calculateCompatibility, findMatches };
