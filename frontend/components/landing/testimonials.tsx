import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Ramesh Patil",
    location: "Nashik, Maharashtra",
    crop: "Grape Farmer",
    quote: "CropMind AI ने माझ्या द्राक्ष शेतीत क्रांती आणली. आता मला रोज माहिती मिळते की काय करायचे.",
    translation: "CropMind AI revolutionized my grape farming. Now I know daily what needs to be done.",
    rating: 5,
  },
  {
    name: "Suresh Kumar",
    location: "Punjab",
    crop: "Wheat Farmer",
    quote: "मौसम की जानकारी और खाद के समय की सही सलाह मिलती है। फसल 20% ज्यादा हुई इस साल।",
    translation: "I get accurate weather info and fertilizer timing advice. Crop yield increased 20% this year.",
    rating: 5,
  },
  {
    name: "Lakshmi Devi",
    location: "Andhra Pradesh",
    crop: "Rice Farmer",
    quote: "The pest alerts saved my entire crop last monsoon. This app truly understands farming.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by Farmers Across India
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from farmers who transformed their farming with CropMind AI
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="flex-1">
                <p className="text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                {testimonial.translation && (
                  <p className="mt-2 text-sm italic text-muted-foreground">
                    &ldquo;{testimonial.translation}&rdquo;
                  </p>
                )}
              </blockquote>
              <div className="mt-6 border-t border-border pt-4">
                <div className="font-medium">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.crop} • {testimonial.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
