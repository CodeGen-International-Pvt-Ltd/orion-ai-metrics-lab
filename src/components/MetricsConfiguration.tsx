
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, BarChart3, ArrowRight } from "lucide-react";

interface MetricsConfigurationProps {
  config: any;
  setConfig: (config: any) => void;
  testSuites: any[];
  onNext: () => void;
  onBack: () => void;
}

const MetricsConfiguration = ({ config, setConfig, testSuites, onNext, onBack }: MetricsConfigurationProps) => {
  const [selectedTestSuiteId, setSelectedTestSuiteId] = useState(testSuites[0]?.id || '');

  const predefinedMetrics = [
    { id: 'correctness', name: 'Correctness', defaultThreshold: 95, description: 'Accuracy of responses', defaultEnabled: true },
    { id: 'hallucination', name: 'Hallucination Rate', defaultThreshold: 5, description: 'Rate of false information', inverted: true, defaultEnabled: true },
    { id: 'answer_relevancy', name: 'Answer Relevancy', defaultThreshold: 95, description: 'Relevance to the question', defaultEnabled: true },
    { id: 'contextual_relevance', name: 'Contextual Relevance', defaultThreshold: 95, description: 'Context appropriateness', defaultEnabled: true }
  ];

  const evaluationTypes = [
    'Summarization',
    'Retrieval of identical or similar content',
    'Retrieval across multiple templates/formats',
    'Retrieval across time series',
    'Graph generation',
    'Arithmetic accuracy',
    'Logical reasoning',
    'Counterfactual reasoning',
    'Inference tasks',
    'Interactive question/answering'
  ];

  const statisticalMethods = [
    'BLEU', 'ROUGE', 'METEOR', 'Levenshtein distance', 'R-Precision'
  ];

  const modelBasedMethods = [
    'BERT', 'BART', 'DistilBERT', 'RoBERTa', 'BLEURT', 'G-Eval', 'BERTScore', 'SPICE', 'WMD', 'ELMO'
  ];

  // Initialize config for selected test suite with defaults if not already set
  const initializeDefaults = (testSuiteId: string) => {
    if (!config.testSuiteConfigs) {
      setConfig({ ...config, testSuiteConfigs: {} });
    }
    
    if (!config.testSuiteConfigs?.[testSuiteId]) {
      const defaultMetrics = {};
      predefinedMetrics.forEach(metric => {
        defaultMetrics[metric.id] = {
          enabled: metric.defaultEnabled,
          threshold: metric.defaultThreshold
        };
      });
      
      setConfig({
        ...config,
        testSuiteConfigs: {
          ...config.testSuiteConfigs,
          [testSuiteId]: {
            metrics: defaultMetrics,
            evaluationTypes: {},
            statisticalMethods: {},
            modelBasedMethods: {}
          }
        }
      });
    }
  };

  // Initialize defaults when component mounts or test suite changes
  useState(() => {
    if (selectedTestSuiteId) {
      initializeDefaults(selectedTestSuiteId);
    }
  });

  const getCurrentConfig = () => {
    return config.testSuiteConfigs?.[selectedTestSuiteId] || {};
  };

  const updateTestSuiteConfig = (field: string, value: any) => {
    setConfig({
      ...config,
      testSuiteConfigs: {
        ...config.testSuiteConfigs,
        [selectedTestSuiteId]: {
          ...getCurrentConfig(),
          [field]: value
        }
      }
    });
  };

  const updateMetricConfig = (metricId: string, field: string, value: any) => {
    const currentConfig = getCurrentConfig();
    updateTestSuiteConfig('metrics', {
      ...currentConfig.metrics,
      [metricId]: {
        ...currentConfig.metrics?.[metricId],
        [field]: value
      }
    });
  };

  const selectedTestSuite = testSuites.find(suite => suite.id === selectedTestSuiteId);

  if (testSuites.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>No Test Suites Available</CardTitle>
            <CardDescription>
              Please create at least one test suite before configuring metrics.
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back to Test Suites
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Metrics Configuration
          </CardTitle>
          <CardDescription>
            Configure evaluation metrics and thresholds for your test suites (optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Suite Selection */}
          <div className="space-y-2">
            <Label>Select Test Suite to Configure</Label>
            <Select
              value={selectedTestSuiteId}
              onValueChange={(value) => {
                setSelectedTestSuiteId(value);
                initializeDefaults(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a test suite" />
              </SelectTrigger>
              <SelectContent>
                {testSuites.map((suite) => (
                  <SelectItem key={suite.id} value={suite.id}>
                    {suite.name} ({suite.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTestSuite && (
              <p className="text-sm text-gray-600">
                Configuring: <span className="font-medium">{selectedTestSuite.name}</span>
              </p>
            )}
          </div>

          <Tabs defaultValue="predefined" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="predefined">Core Metrics</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluation Types</TabsTrigger>
              <TabsTrigger value="scoring">Scoring Methods</TabsTrigger>
            </TabsList>

            <TabsContent value="predefined" className="space-y-4">
              <h3 className="text-lg font-semibold">Predefined Metrics</h3>
              <p className="text-sm text-gray-600 mb-4">Default metrics are pre-selected. You can customize which metrics to include in your evaluation.</p>
              <div className="grid gap-4">
                {predefinedMetrics.map((metric) => {
                  const currentConfig = getCurrentConfig();
                  const isEnabled = currentConfig.metrics?.[metric.id]?.enabled ?? metric.defaultEnabled;
                  const threshold = currentConfig.metrics?.[metric.id]?.threshold ?? metric.defaultThreshold;
                  
                  return (
                    <Card key={metric.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={isEnabled}
                            onCheckedChange={(checked) => updateMetricConfig(metric.id, 'enabled', checked)}
                          />
                          <div>
                            <Label className="text-base font-medium">{metric.name}</Label>
                            <p className="text-sm text-gray-600">{metric.description}</p>
                          </div>
                        </div>
                        <BarChart3 className="w-5 h-5 text-gray-400" />
                      </div>
                      
                      {isEnabled && (
                        <div className="space-y-3">
                          <Label>Threshold: {threshold}%</Label>
                          <Slider
                            value={[threshold]}
                            onValueChange={([value]) => updateMetricConfig(metric.id, 'threshold', value)}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="evaluation" className="space-y-4">
              <h3 className="text-lg font-semibold">Evaluation Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evaluationTypes.map((type) => {
                  const currentConfig = getCurrentConfig();
                  const isChecked = currentConfig.evaluationTypes?.[type] || false;
                  
                  return (
                    <div key={type} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const currentConfig = getCurrentConfig();
                          updateTestSuiteConfig('evaluationTypes', {
                            ...currentConfig.evaluationTypes,
                            [type]: checked
                          });
                        }}
                      />
                      <Label className="text-sm">{type}</Label>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="scoring" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Statistical Methods</h3>
                  <div className="space-y-3">
                    {statisticalMethods.map((method) => {
                      const currentConfig = getCurrentConfig();
                      const isChecked = currentConfig.statisticalMethods?.[method] || false;
                      
                      return (
                        <div key={method} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const currentConfig = getCurrentConfig();
                              updateTestSuiteConfig('statisticalMethods', {
                                ...currentConfig.statisticalMethods,
                                [method]: checked
                              });
                            }}
                          />
                          <Label className="text-sm">{method}</Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Model-Based Methods</h3>
                  <div className="space-y-3">
                    {modelBasedMethods.map((method) => {
                      const currentConfig = getCurrentConfig();
                      const isChecked = currentConfig.modelBasedMethods?.[method] || false;
                      
                      return (
                        <div key={method} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const currentConfig = getCurrentConfig();
                              updateTestSuiteConfig('modelBasedMethods', {
                                ...currentConfig.modelBasedMethods,
                                [method]: checked
                              });
                            }}
                          />
                          <Label className="text-sm">{method}</Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
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
