import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  createAlert,
  getAlerts,
  getAlertCounts,
} from '@/lib/actions/alert.actions';

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'counts') {
      const counts = await getAlertCounts(session.user.id);
      return NextResponse.json(counts);
    }

    const alerts = await getAlerts(session.user.id);
    return NextResponse.json(alerts);
  } catch (error) {
    console.error('GET /api/alerts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { symbol, company, alertType, targetPrice, targetVolume, condition } = body;

    if (!symbol || !company || !alertType) {
      return NextResponse.json(
        { error: 'Missing required fields: symbol, company, alertType' },
        { status: 400 }
      );
    }

    if ((alertType === 'price_above' || alertType === 'price_below') && !targetPrice) {
      return NextResponse.json(
        { error: 'targetPrice is required for price alerts' },
        { status: 400 }
      );
    }

    if (alertType === 'volume_above' && !targetVolume) {
      return NextResponse.json(
        { error: 'targetVolume is required for volume alerts' },
        { status: 400 }
      );
    }

    const result = await createAlert(session.user.id, {
      symbol,
      company,
      alertType,
      targetPrice,
      targetVolume,
      condition,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('POST /api/alerts error:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}