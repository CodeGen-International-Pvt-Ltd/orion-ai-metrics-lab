
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, ArrowRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MetricsConfigurationProps {
  config: any;
  setConfig: (config: any) => void;
  testSuites: any[];
  onNext: () => void;
  onBack: () => void;
}

const MetricsConfiguration = ({ config, setConfig, testSuites, onNext, onBack }: MetricsConfigurationProps) => {
  const [selectedTestSuiteId, setSelectedTestSuiteId] = useState(testSuites[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const modelBasedScores = [
    { 
      id: 'nli', 
      name: 'NLI', 
      defaultThreshold: 85,
      subScores: [
        { id: 'bart', name: 'BART', defaultThreshold: 85 },
        { id: 'roberta', name: 'RoBERTa', defaultThreshold: 85 }
      ]
    },
    { id: 'bleurt', name: 'BLEURT', defaultThreshold: 80 },
    { 
      id: 'g_eval', 
      name: 'G-Eval', 
      defaultThreshold: 85,
      subScores: [
        { id: 'fluency', name: 'Fluency', defaultThreshold: 85 },
        { id: 'conciseness', name: 'Conciseness', defaultThreshold: 80 },
        { id: 'relevance', name: 'Relevance', defaultThreshold: 85 },
        { id: 'correctness', name: 'Correctness', defaultThreshold: 90 },
        { id: 'hallucination', name: 'Hallucination', defaultThreshold: 5, inverted: true }
      ]
    }
  ];

  const statisticalScores = [
    { id: 'rouge', name: 'ROUGE', defaultThreshold: 75 },
    { id: 'bleu', name: 'BLEU', defaultThreshold: 70 },
    { id: 'meteor', name: 'METEOR', defaultThreshold: 75 }
  ];

  const initializeDefaults = (testSuiteId: string) => {
    if (!config.testSuiteConfigs) {
      setConfig({ ...config, testSuiteConfigs: {} });
    }
    
    if (!config.testSuiteConfigs?.[testSuiteId]) {
      const defaultModelBased = {};
      modelBasedScores.forEach(score => {
        defaultModelBased[score.id] = {
          threshold: score.defaultThreshold
        };
        if (score.subScores) {
          score.subScores.forEach(subScore => {
            defaultModelBased[`${score.id}_${subScore.id}`] = {
              threshold: subScore.defaultThreshold
            };
          });
        }
      });

      const defaultStatistical = {};
      statisticalScores.forEach(score => {
        defaultStatistical[score.id] = {
          threshold: score.defaultThreshold
        };
      });
      
      setConfig({
        ...config,
        testSuiteConfigs: {
          ...config.testSuiteConfigs,
          [testSuiteId]: {
            modelBasedScores: defaultModelBased,
            statisticalScores: defaultStatistical
          }
        }
      });
    }
  };

  useEffect(() => {
    if (selectedTestSuiteId) {
      initializeDefaults(selectedTestSuiteId);
    }
  }, [selectedTestSuiteId]);

  const getCurrentConfig = () => {
    return config.testSuiteConfigs?.[selectedTestSuiteId] || {};
  };

  const updateScoreConfig = (category: string, scoreId: string, value: number) => {
    const currentConfig = getCurrentConfig();
    setConfig({
      ...config,
      testSuiteConfigs: {
        ...config.testSuiteConfigs,
        [selectedTestSuiteId]: {
          ...currentConfig,
          [category]: {
            ...currentConfig[category],
            [scoreId]: {
              threshold: value
            }
          }
        }
      }
    });
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: "Configuration Saved",
      description: `Settings for ${selectedTestSuite?.name} have been saved successfully.`,
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

  const currentConfig = getCurrentConfig();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Metrics Configuration
              </CardTitle>
              <CardDescription>
                Configure scoring methods and thresholds for your test suites
              </CardDescription>
            </div>
            <Button 
              onClick={handleSaveConfiguration}
              disabled={isSaving || !selectedTestSuiteId}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
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

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Scoring Methods</h3>
            <p className="text-sm text-gray-600">All scoring methods are automatically selected with default thresholds. You can adjust thresholds as needed.</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Model Based Scores */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Model Based Scoring</h4>
                <div className="space-y-4">
                  {modelBasedScores.map((score) => (
                    <Card key={score.id} className="p-4">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium">{score.name}</Label>
                          <div className="mt-2">
                            <Label className="text-sm">Threshold: {currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold}%</Label>
                            <Slider
                              value={[currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold]}
                              onValueChange={([value]) => updateScoreConfig('modelBasedScores', score.id, value)}
                              min={0}
                              max={100}
                              step={1}
                              className="w-full mt-1"
                            />
                          </div>
                        </div>
                        
                        {score.subScores && (
                          <div className="pl-4 border-l-2 border-gray-200 space-y-3">
                            {score.subScores.map((subScore) => {
                              const subScoreKey = `${score.id}_${subScore.id}`;
                              const threshold = currentConfig.modelBasedScores?.[subScoreKey]?.threshold ?? subScore.defaultThreshold;
                              return (
                                <div key={subScore.id}>
                                  <Label className="text-sm font-medium">{subScore.name}</Label>
                                  <div className="mt-1">
                                    <Label className="text-xs">Threshold: {threshold}%</Label>
                                    <Slider
                                      value={[threshold]}
                                      onValueChange={([value]) => updateScoreConfig('modelBasedScores', subScoreKey, value)}
                                      min={0}
                                      max={100}
                                      step={1}
                                      className="w-full mt-1"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Statistical Scores */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Statistical Scoring</h4>
                <div className="space-y-4">
                  {statisticalScores.map((score) => {
                    const threshold = currentConfig.statisticalScores?.[score.id]?.threshold ?? score.defaultThreshold;
                    return (
                      <Card key={score.id} className="p-4">
                        <div>
                          <Label className="text-base font-medium">{score.name}</Label>
                          <div className="mt-2">
                            <Label className="text-sm">Threshold: {threshold}%</Label>
                            <Slider
                              value={[threshold]}
                              onValueChange={([value]) => updateScoreConfig('statisticalScores', score.id, value)}
                              min={0}
                              max={100}
                              step={1}
                              className="w-full mt-1"
                            />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
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
