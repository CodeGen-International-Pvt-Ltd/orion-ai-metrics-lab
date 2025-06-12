
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
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

  const contentEvaluation = [
    { id: 'correctness', name: 'Correctness', defaultThreshold: 90 },
    { id: 'hallucination', name: 'Hallucination', defaultThreshold: 5, inverted: true },
    { id: 'answer_relevancy', name: 'Answer Relevancy', defaultThreshold: 85 },
    { id: 'contextual_relevancy', name: 'Contextual Relevancy', defaultThreshold: 85 }
  ];

  const retrievalGeneration = [
    { id: 'summarization', name: 'Summarization', defaultThreshold: 80 },
    { id: 'retrieving_content', name: 'Retrieving Content', defaultThreshold: 75 }
  ];

  const functionalTesting = [
    { id: 'leading_questions', name: 'Leading Questions', defaultThreshold: 85 },
    { id: 'edge_cases', name: 'Edge Cases', defaultThreshold: 80 },
    { id: 'unnecessary_context', name: 'Unnecessary Context', defaultThreshold: 75 }
  ];

  const nonFunctionalTesting = [
    { id: 'repetitive_loops', name: 'Repetitive Loops', defaultThreshold: 10, inverted: true },
    { id: 'spam_flooding', name: 'Spam/Flooding', defaultThreshold: 5, inverted: true },
    { id: 'intentional_misdirection', name: 'Intentional Misdirection', defaultThreshold: 5, inverted: true },
    { id: 'prompt_overloading', name: 'Prompt Overloading', defaultThreshold: 10, inverted: true },
    { id: 'prompt_tuning_attacks', name: 'Susceptibility to Prompt Tuning Attacks', defaultThreshold: 5, inverted: true }
  ];

  const initializeDefaults = (testSuiteId: string) => {
    if (!config.testSuiteConfigs) {
      setConfig({ ...config, testSuiteConfigs: {} });
    }
    
    if (!config.testSuiteConfigs?.[testSuiteId]) {
      const defaultContentEval = {};
      contentEvaluation.forEach(score => {
        defaultContentEval[score.id] = {
          threshold: score.defaultThreshold
        };
      });

      const defaultRetrievalGen = {};
      retrievalGeneration.forEach(score => {
        defaultRetrievalGen[score.id] = {
          threshold: score.defaultThreshold
        };
      });

      const defaultFunctional = {};
      functionalTesting.forEach(score => {
        defaultFunctional[score.id] = {
          threshold: score.defaultThreshold
        };
      });

      const defaultNonFunctional = {};
      nonFunctionalTesting.forEach(score => {
        defaultNonFunctional[score.id] = {
          threshold: score.defaultThreshold
        };
      });
      
      setConfig({
        ...config,
        testSuiteConfigs: {
          ...config.testSuiteConfigs,
          [testSuiteId]: {
            contentEvaluation: defaultContentEval,
            retrievalGeneration: defaultRetrievalGen,
            functionalTesting: defaultFunctional,
            nonFunctionalTesting: defaultNonFunctional
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
        <Card className="bg-card dark:bg-card border-border dark:border-border">
          <CardHeader>
            <CardTitle className="text-foreground">No Test Suites Available</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please create at least one test suite before configuring metrics.
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="border-border hover:bg-accent">
            Back to Test Suites
          </Button>
        </div>
      </div>
    );
  }

  const currentConfig = getCurrentConfig();

  const renderScoreSection = (scores: any[], category: string, title: string, color: string) => (
    <div className="space-y-4">
      <h4 className={`text-lg font-semibold mb-4 ${color} text-left`}>{title}</h4>
      <div className="space-y-4">
        {scores.map((score) => (
          <Card key={score.id} className={`p-4 transform transition-all duration-300 hover:shadow-lg hover:scale-102 border-l-4 bg-card dark:bg-card/80 backdrop-blur-sm border-border dark:border-border/60 ${color.includes('indigo') ? 'border-l-indigo-500 dark:border-l-indigo-400' : color.includes('purple') ? 'border-l-purple-500 dark:border-l-purple-400' : color.includes('green') ? 'border-l-green-500 dark:border-l-green-400' : 'border-l-orange-500 dark:border-l-orange-400'}`}>
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium text-foreground text-left block">{score.name}</Label>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-muted-foreground">Threshold: {currentConfig[category]?.[score.id]?.threshold ?? score.defaultThreshold}%</Label>
                  </div>
                  <Slider
                    value={[currentConfig[category]?.[score.id]?.threshold ?? score.defaultThreshold]}
                    onValueChange={([value]) => updateScoreConfig(category, score.id, value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="transform transition-all duration-300 hover:shadow-lg bg-card dark:bg-card/90 backdrop-blur-lg border-border dark:border-border/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Settings className="w-5 h-5 text-primary" />
                Metrics Configuration
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure scoring methods and thresholds for your test suites
              </CardDescription>
            </div>
            <Button 
              onClick={handleSaveConfiguration}
              disabled={isSaving || !selectedTestSuiteId}
              className="bg-primary hover:bg-primary/90 text-primary-foreground transform transition-all duration-200 hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Suite Selection */}
          <div className="space-y-2">
            <Label className="text-foreground">Select Test Suite to Configure</Label>
            <Select
              value={selectedTestSuiteId}
              onValueChange={(value) => {
                setSelectedTestSuiteId(value);
                initializeDefaults(value);
              }}
            >
              <SelectTrigger className="transform transition-all duration-200 hover:scale-102 bg-background dark:bg-background/80 border-border">
                <SelectValue placeholder="Select a test suite" />
              </SelectTrigger>
              <SelectContent className="bg-background dark:bg-background/95 backdrop-blur-lg border-border">
                {testSuites.map((suite) => (
                  <SelectItem key={suite.id} value={suite.id} className="hover:bg-accent focus:bg-accent">
                    {suite.name} ({suite.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTestSuite && (
              <p className="text-sm text-muted-foreground animate-fade-in">
                Configuring: <span className="font-medium text-primary">{selectedTestSuite.name}</span>
              </p>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Scoring Methods</h3>
            <p className="text-sm text-muted-foreground">All scoring methods are automatically selected with default thresholds. You can adjust thresholds as needed.</p>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Content Evaluation */}
              {renderScoreSection(contentEvaluation, 'contentEvaluation', 'Content Evaluation', 'text-indigo-700 dark:text-indigo-300')}
              
              {/* Retrieval and Generation Evaluation */}
              {renderScoreSection(retrievalGeneration, 'retrievalGeneration', 'Retrieval and Generation Evaluation', 'text-purple-700 dark:text-purple-300')}
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Functional Testing */}
              {renderScoreSection(functionalTesting, 'functionalTesting', 'Functional Testing', 'text-green-700 dark:text-green-300')}
              
              {/* Non-Functional Testing */}
              {renderScoreSection(nonFunctionalTesting, 'nonFunctionalTesting', 'Non-Functional Testing', 'text-orange-700 dark:text-orange-300')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="transform transition-all duration-200 hover:scale-105 border-border hover:bg-accent">
          Back
        </Button>
        <Button onClick={onNext} className="bg-primary hover:bg-primary/90 text-primary-foreground transform transition-all duration-200 hover:scale-105">
          Continue to Model Selection <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MetricsConfiguration;
