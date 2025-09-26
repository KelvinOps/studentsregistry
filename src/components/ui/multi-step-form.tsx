import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: ReactNode;
  component: ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export default function MultiStepForm({ steps, currentStep, onStepChange }: MultiStepFormProps) {
  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex items-center space-x-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index < currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : index === currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
                data-testid={`step-indicator-${index}`}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span 
                className={`text-sm font-medium transition-colors ${
                  index === currentStep 
                    ? 'text-foreground' 
                    : index < currentStep 
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`w-8 h-0.5 mx-4 transition-colors ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <Card>
        <CardContent className="p-8">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="text-primary mr-3">
                {steps[currentStep].icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {steps[currentStep].title}
                </h2>
                <p className="text-muted-foreground">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>
          </div>
          {steps[currentStep].component}
        </CardContent>
      </Card>
    </div>
  );
}
