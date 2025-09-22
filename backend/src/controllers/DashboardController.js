exports.getStats = (req, res) => {
    const mockStats = {
        tasksToDo: 5,
        tasksInProgress: 3,
        tasksCompleted: 12,
        totalUsers: 25,
    };
    res.json(mockStats);
};