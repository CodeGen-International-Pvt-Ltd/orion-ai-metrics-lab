
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BarChart3 } from "lucide-react";

interface Metric {
  id: string;
  name: string;
  defaultThreshold: number;
  description: string;
  inverted?: boolean;
  defaultEnabled: boolean;
}

interface CoreMetricsSelectorProps {
  metrics: any;
  updateMetricConfig: (metricId: string, field: string, value: any) => void;
}

const CoreMetricsSelector = ({ metrics, updateMetricConfig }: CoreMetricsSelectorProps) => {
  const predefinedMetrics: Metric[] = [
    { id: 'correctness', name: 'Correctness', defaultThreshold: 95, description: 'Accuracy of responses', defaultEnabled: true },
    { id: 'hallucination', name: 'Hallucination Rate', defaultThreshold: 5, description: 'Rate of false information', inverted: true, defaultEnabled: true },
    { id: 'answer_relevancy', name: 'Answer Relevancy', defaultThreshold: 95, description: 'Relevance to the question', defaultEnabled: true },
    { id: 'contextual_relevance', name: 'Contextual Relevance', defaultThreshold: 95, description: 'Context appropriateness', defaultEnabled: true }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Predefined Metrics</h3>
      <p className="text-sm text-gray-600 mb-4">Default metrics are pre-selected. You can customize which metrics to include in your evaluation.</p>
      <div className="grid gap-4">
        {predefinedMetrics.map((metric) => (
          <Card key={metric.id} className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={metrics?.[metric.id]?.enabled ?? metric.defaultEnabled}
                  onCheckedChange={(checked) => updateMetricConfig(metric.id, 'enabled', checked)}
                />
                <div>
                  <Label className="text-base font-medium">{metric.name}</Label>
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
              </div>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            {(metrics?.[metric.id]?.enabled ?? metric.defaultEnabled) && (
              <div className="space-y-3">
                <Label>Threshold: {metrics?.[metric.id]?.threshold ?? metric.defaultThreshold}%</Label>
                <Slider
                  value={[metrics?.[metric.id]?.threshold ?? metric.defaultThreshold]}
                  onValueChange={([value]) => updateMetricConfig(metric.id, 'threshold', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoreMetricsSelector;
