export default async function handler(req, res) {
  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/bookings?select=quantity`,
      {
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(errorText);
      throw new Error("Supabase error");
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
    console.error(error);

    res.status(500).json({
      error: "Unable to load booking count"
    });
  }
}
