const GoodCatch = require('../models/goodCatch');

const deleteCatch = async (req, res) => {
  try {
    const goodCatchId = req.params.id; // Get the ID from the URL
    const userId = req.user.id; // Assuming you have user ID stored in req.user after authentication

    // Find the good catch by ID
    const goodCatch = await GoodCatch.findById(goodCatchId);

    if (!goodCatch) {
      return res.status(404).json({ message: 'Good Catch not found' });
    }

    // Check if the user is the creator or is kevinWagner
    if (goodCatch.createdBy !== userId && userId !== 'kevinWagner') {
      return res.status(403).json({ message: 'You are not authorized to delete this record' });
    }

    // Delete the good catch
    await GoodCatch.findByIdAndDelete(goodCatchId);

    res.status(200).json({ message: 'Good Catch deleted successfully' });
  } catch (error) {
    console.error('Error deleting Good Catch:', error);
    res.status(500).json({ message: 'Failed to delete Good Catch' });
  }
};

module.exports = deleteCatch;
