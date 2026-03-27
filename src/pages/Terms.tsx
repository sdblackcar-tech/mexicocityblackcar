import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <p className="text-sm font-body tracking-[0.3em] uppercase text-gold mb-4">
            Legal
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-12">
            Terms & Conditions
          </h1>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <div>
              <h2 className="font-display text-lg text-foreground mb-3">1. Service Agreement</h2>
              <p>
                By booking transportation services through Mexico City Black Car or Mikey AI, you agree to these terms and conditions. All services are provided by Infinite Logistics Technologies and its authorized operators.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-foreground mb-3">2. Booking & Cancellation</h2>
              <p>
                Reservations can be made through Mikey AI, our website, or authorized booking channels. Cancellations must be made at least 4 hours prior to the scheduled pickup time. Late cancellations may incur a fee equivalent to 50% of the service cost.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-foreground mb-3">3. Payment</h2>
              <p>
                Payment is required at the time of booking or upon completion of service, depending on the arrangement. We accept major credit cards and approved corporate billing. All prices are quoted in USD unless otherwise specified.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-foreground mb-3">4. Liability</h2>
              <p>
                Mexico City Black Car maintains comprehensive insurance coverage for all vehicles in our fleet. However, we are not liable for delays caused by traffic, weather, road conditions, or other circumstances beyond our reasonable control.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-foreground mb-3">5. Privacy & Data</h2>
              <p>
                We respect your privacy. Personal information collected during booking is used solely for service coordination and will not be shared with third parties except as required by law. Mikey AI processes requests securely with enterprise-grade encryption.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-foreground mb-3">6. Intellectual Property</h2>
              <p>
                Mikey AI, its algorithms, and all associated technology are proprietary to Infinite Logistics Technologies. Patents pending. Unauthorized reproduction or use of our technology is strictly prohibited.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-foreground mb-3">7. Contact</h2>
              <p>
                For questions regarding these terms, please contact us through the Talk to Mikey feature or email our support team directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
