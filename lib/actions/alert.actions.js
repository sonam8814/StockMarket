'use server';

import connectToDatabase from '@/lib/database';
import Alert from '@/lib/database/models/alert.model';

export async function createAlert(userId, alertData) {
  try {
    await connectToDatabase();

    const alert = await Alert.create({
      userId,
      symbol: alertData.symbol.toUpperCase(),
      company: alertData.company,
      alertType: alertData.alertType,
      targetPrice: alertData.targetPrice,
      targetVolume: alertData.targetVolume,
      condition: alertData.condition || 'greater_than',
      isActive: true,
    });

    return { success: true, data: alert };
  } catch (error) {
    console.error('Error creating alert:', error);
    return { success: false, error: 'Failed to create alert' };
  }
}

export async function getAlerts(userId) {
  try {
    await connectToDatabase();

    const alerts = await Alert.find({ userId }).sort({ createdAt: -1 });
    return alerts;
  } catch (error) {
    console.error('Error getting alerts:', error);
    return [];
  }
}

export async function getActiveAlerts(userId) {
  try {
    await connectToDatabase();

    const alerts = await Alert.find({ userId, isActive: true }).sort({ createdAt: -1 });
    return alerts;
  } catch (error) {
    console.error('Error getting active alerts:', error);
    return [];
  }
}

export async function getAllActiveAlerts() {
  try {
    await connectToDatabase();

    const alerts = await Alert.find({ isActive: true });
    return alerts;
  } catch (error) {
    console.error('Error getting all active alerts:', error);
    return [];
  }
}

export async function updateAlert(userId, alertId, updateData) {
  try {
    await connectToDatabase();

    const alert = await Alert.findOneAndUpdate(
      { _id: alertId, userId },
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );

    if (!alert) {
      return { success: false, error: 'Alert not found' };
    }

    return { success: true, data: alert };
  } catch (error) {
    console.error('Error updating alert:', error);
    return { success: false, error: 'Failed to update alert' };
  }
}

export async function deleteAlert(userId, alertId) {
  try {
    await connectToDatabase();

    const result = await Alert.deleteOne({ _id: alertId, userId });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Alert not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting alert:', error);
    return { success: false, error: 'Failed to delete alert' };
  }
}

export async function toggleAlert(userId, alertId) {
  try {
    await connectToDatabase();

    const alert = await Alert.findOne({ _id: alertId, userId });

    if (!alert) {
      return { success: false, error: 'Alert not found' };
    }

    alert.isActive = !alert.isActive;
    alert.updatedAt = Date.now();
    await alert.save();

    return { success: true, data: alert };
  } catch (error) {
    console.error('Error toggling alert:', error);
    return { success: false, error: 'Failed to toggle alert' };
  }
}

export async function markAlertTriggered(userId, alertId) {
  try {
    await connectToDatabase();

    const alert = await Alert.findOneAndUpdate(
      { _id: alertId, userId },
      {
        triggeredAt: Date.now(),
        isActive: false,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    return { success: true, data: alert };
  } catch (error) {
    console.error('Error marking alert as triggered:', error);
    return { success: false, error: 'Failed to mark alert as triggered' };
  }
}

export async function updateLastChecked(alertId) {
  try {
    await connectToDatabase();

    await Alert.findByIdAndUpdate(alertId, {
      lastCheckedAt: Date.now(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating last checked:', error);
    return { success: false };
  }
}

export async function getAlertsBySymbol(symbol) {
  try {
    await connectToDatabase();

    const alerts = await Alert.find({
      symbol: symbol.toUpperCase(),
      isActive: true,
    });

    return alerts;
  } catch (error) {
    console.error('Error getting alerts by symbol:', error);
    return [];
  }
}

export async function getAlertCounts(userId) {
  try {
    await connectToDatabase();

    const total = await Alert.countDocuments({ userId });
    const active = await Alert.countDocuments({ userId, isActive: true });
    const triggered = await Alert.countDocuments({ userId, isActive: false });

    return { total, active, triggered };
  } catch (error) {
    console.error('Error getting alert counts:', error);
    return { total: 0, active: 0, triggered: 0 };
  }
}