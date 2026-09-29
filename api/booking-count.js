export default async function handler(req, res) {
  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/bookings?select=quantity`
    );

    if (!response.ok) {
      throw new Error("Database error");
    }

    const bookings = await response.json();

    const booked = bookings.reduce(
      (total, booking) => total + Number(booking.quantity || 0),
      0
    );

    res.status(200).json({
      booked,
      remaining: Math.max(0, 350 - booked)
    });

  } catch (error) {

    res.status(500).json({
      error: "Unable to load booking count"
    });

  }
}
