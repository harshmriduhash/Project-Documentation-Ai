import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      content: "Documentation Magic really helps me to maintain my codebase. So far now my finances are well managed without any excess expenses. I highly recommend it that I tell very satisfied.",
      author: "Don Sarongs",
      role: "Senior Developer at TechAce",
      avatar: "/placeholder.svg"
    },
    {
      content: "Since using this tool, my documentation has become more structured and time-saving. This is very helpful. I am very grateful with lovable.",
      author: "Alexa Melans",
      role: "Frontend Developer at Spotify",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Why they love our Documentation Generator
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-800 border-0">
              <CardContent className="p-6">
                <p className="mb-6 text-gray-300">{testimonial.content}</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;