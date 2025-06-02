
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, ArrowRight } from "lucide-react";
import CoreMetricsSelector from './metrics/CoreMetricsSelector';
import EvaluationTypesSelector from './metrics/EvaluationTypesSelector';
import ScoringMethodsSelector from './metrics/ScoringMethodsSelector';

interface MetricsConfigurationProps {
  config: any;
  setConfig: (config: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const MetricsConfiguration = ({ config, setConfig, onNext, onBack }: MetricsConfigurationProps) => {
  // Initialize config with default metrics if not already set
  const initializeDefaults = () => {
    if (!config.metrics) {
      const defaultMetrics = {
        correctness: { enabled: true, threshold: 95 },
        hallucination: { enabled: true, threshold: 5 },
        answer_relevancy: { enabled: true, threshold: 95 },
        contextual_relevance: { enabled: true, threshold: 95 }
      };
      setConfig({
        ...config,
        metrics: defaultMetrics
      });
    }
  };

  // Initialize defaults on component mount
  useState(() => {
    initializeDefaults();
  });

  const updateMetricConfig = (metricId: string, field: string, value: any) => {
    setConfig({
      ...config,
      metrics: {
        ...config.metrics,
        [metricId]: {
          ...config.metrics?.[metricId],
          [field]: value
        }
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Metrics Configuration
          </CardTitle>
          <CardDescription>
            Configure evaluation metrics and thresholds (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="predefined" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="predefined">Core Metrics</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation Types</TabsTrigger>
              <TabsTrigger value="scoring">Scoring Methods</TabsTrigger>
            </TabsList>

            <TabsContent value="predefined" className="space-y-4">
              <CoreMetricsSelector 
                metrics={config.metrics} 
                updateMetricConfig={updateMetricConfig} 
              />
            </TabsContent>

            <TabsContent value="evaluation" className="space-y-4">
              <EvaluationTypesSelector 
                config={config} 
                setConfig={setConfig} 
              />
            </TabsContent>

            <TabsContent value="scoring" className="space-y-6">
              <ScoringMethodsSelector 
                config={config} 
                setConfig={setConfig} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
          Continue to Model Selection <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MetricsConfiguration;
