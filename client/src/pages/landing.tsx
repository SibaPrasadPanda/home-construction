import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, DollarSign, StickyNote, CheckSquare, ArrowRight } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: DollarSign,
      title: "Finance Tracking",
      description: "Monitor construction expenses, set budgets, and track spending across categories"
    },
    {
      icon: StickyNote,
      title: "Notes Management",
      description: "Organize ideas, materials lists, and tasks with searchable tags"
    },
    {
      icon: CheckSquare,
      title: "Progress Milestones",
      description: "Track construction phases from foundation to completion"
    },
    {
      icon: Home,
      title: "Project Dashboard",
      description: "Get a complete overview of your home construction project"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-construction-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-construction rounded-2xl flex items-center justify-center">
              <Home className="text-white text-2xl" size={32} />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Nivasa
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Your complete home construction management platform. Track expenses, organize notes, and monitor progress all in one place.
          </p>
          <Button 
            size="lg" 
            className="bg-construction hover:bg-construction-600 text-white px-8 py-3 text-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-construction/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-construction-600" size={24} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
            Join thousands of builders who trust Nivasa to manage their construction projects efficiently.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Start Your Project
          </Button>
        </div>
      </div>
    </div>
  );
}