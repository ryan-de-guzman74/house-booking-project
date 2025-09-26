export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // In a real application, you would integrate with an email service like:
    // - SendGrid
    // - Nodemailer with SMTP
    // - AWS SES
    // - Resend
    // For this demo, we'll just log the contact form data
    
    console.log('Contact Form Submission:', {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    });

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    return Response.json({ 
      success: true, 
      message: 'Thank you for your message! We will get back to you soon.' 
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return Response.json({ 
      error: 'Failed to send message. Please try again later.' 
    }, { status: 500 });
  }
}
