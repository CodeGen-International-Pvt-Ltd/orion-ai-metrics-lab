import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Settings, ArrowRight, Save, Edit, Trash2, Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getBackendUrl } from "../lib/config";
import * as api from "../lib/apiPaths";
import { getConfigurations, createConfiguration, updateConfiguration, getTestRuns } from "../lib/apiService";

interface TestRun {
  test_run_id: number;
  test_suite: number;
  test_run_date: string;
  execution_status: string;
  total_time: string | null;
  evaluation: any;
  test_results: any[];
}

interface MetricsConfigurationProps {
  config: any;
  setConfig: (config: any) => void;
  testSuites: any[];
  onNext: () => void;
  onBack: () => void;
  selectedTestSuiteId: number | null;
  testSuiteResults?: any;
}

const MetricsConfiguration = ({
  config,
  setConfig,
  testSuites,
  onNext,
  onBack,
  selectedTestSuiteId,
}: MetricsConfigurationProps) => {
  const [selectedTestSuiteIdLocal, setSelectedTestSuiteIdLocal] = useState(
    selectedTestSuiteId || testSuites[0]?.id || ''
  );
  const [existingConfig, setExistingConfig] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<any>(null);
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [loadingTestRuns, setLoadingTestRuns] = useState(false);
  const { toast } = useToast();

  const contentEvaluation = [
    { id: 'correctness', name: 'Correctness', defaultThreshold: 50 },
    { id: 'hallucination', name: 'Hallucination', defaultThreshold: 70, inverted: true },
    { id: 'answer relevancy', name: 'Answer Relevancy', defaultThreshold: 60 },
    { id: 'contexual relevancy', name: 'Contextual Relevancy', defaultThreshold: 70 },
  ];

  const retrievalGeneration = [
    { id: 'summarization', name: 'Summarization', defaultThreshold: 60 },
    { id: 'retrieving same/similar content', name: 'Retrieving Content', defaultThreshold: 80 },
  ];

  const functionalTesting = [
    { id: 'leading questions', name: 'Leading Questions', defaultThreshold: 60 },
    { id: 'edge cases', name: 'Edge Cases', defaultThreshold: 70 },
    { id: 'unnecessary context', name: 'Unnecessary Context', defaultThreshold: 50 },
  ];

  const nonFunctionalTesting = [
    { id: 'repetitive loops', name: 'Repetitive Loops', defaultThreshold: 30, inverted: true },
    { id: 'spam/flooding', name: 'Spam/Flooding', defaultThreshold: 20, inverted: true },
    { id: 'intentional misdirection', name: 'Intentional Misdirection', defaultThreshold: 40, inverted: true },
    { id: 'prompt overloading', name: 'Prompt Overloading', defaultThreshold: 30, inverted: true },
    { id: 'susceptibility to prompt tuning attacks', name: 'Susceptibility to Prompt Tuning Attacks', defaultThreshold: 30, inverted: true },
  ];

  const getAllMetrics = () => [
      ...contentEvaluation,
      ...retrievalGeneration,
      ...functionalTesting,
    ...nonFunctionalTesting,
  ];

  // Check if the selected test suite has test runs
  const hasTestRuns = testRuns.length > 0;

  // Fetch test runs for the selected test suite
  const fetchTestRuns = async (testSuiteId: string) => {
    if (!testSuiteId) return;
    
    setLoadingTestRuns(true);
    try {
      const response = await getTestRuns(testSuiteId);
      
      if (response.ok) {
        const data = await response.json();
        const sortedRuns = Array.isArray(data) ? data.sort((a: TestRun, b: TestRun) => 
          new Date(b.test_run_date).getTime() - new Date(a.test_run_date).getTime()
        ) : [];
        setTestRuns(sortedRuns);
        console.log(`Fetched ${sortedRuns.length} test runs for suite ${testSuiteId}`);
      } else {
        console.warn(`Failed to fetch test runs for suite ${testSuiteId}:`, response.status);
        setTestRuns([]);
      }
    } catch (error) {
      console.error(`Error fetching test runs for suite ${testSuiteId}:`, error);
      setTestRuns([]);
    } finally {
      setLoadingTestRuns(false);
    }
  };

  // Helper to map backend category names to frontend keys
  const categoryToKey = (category: string): string => {
    switch (category) {
      case 'content evaluation':
        return 'contentEvaluation';
      case 'retrieval and generation evaluation':
        return 'retrievalGeneration';
      case 'functional testing':
        return 'functionalTesting';
      case 'non functional testing':
        return 'nonFunctionalTesting';
      default:
        return '';
    }
  };

  // Fetch existing configuration from backend
  const fetchExistingConfiguration = async (testSuiteId: string) => {
    try {
      const response = await getConfigurations(testSuiteId);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const configData = data[0];
          setExistingConfig(configData);
          
          // The backend now sends selected_metrics as an object grouped by category
          // So we parse accordingly
          const selectedMetrics = configData.selected_metrics || {};
          const currentConfig: any = {
            contentEvaluation: {},
            retrievalGeneration: {},
            functionalTesting: {},
            nonFunctionalTesting: {},
          };

          Object.entries(selectedMetrics).forEach(([category, metrics]: [string, any]) => {
            const key = categoryToKey(category);
            if (!key) return;
            Object.entries(metrics).forEach(([metricName, threshold]: [string, any]) => {
              // Find metric by name in all metrics
              const metricInfo = getAllMetrics().find(m => m.name === metricName);
              if (metricInfo) {
                currentConfig[key][metricInfo.id] = { threshold: threshold * 100 };
              }
            });
          });

          const newConfig = {
            ...config,
            testSuiteConfigs: {
              ...config.testSuiteConfigs,
              [testSuiteId]: currentConfig,
            },
          };
          
          setConfig(newConfig);
          setOriginalConfig(JSON.parse(JSON.stringify(currentConfig)));
          setHasUnsavedChanges(false);
        } else {
          setExistingConfig(null);
          initializeDefaults(testSuiteId);
        }
      } else {
        setExistingConfig(null);
        initializeDefaults(testSuiteId);
      }
    } catch (error) {
      console.error('Error fetching configuration:', error);
      setExistingConfig(null);
      initializeDefaults(testSuiteId);
    }
  };

  // Initialize default thresholds for a new test suite
  const initializeDefaults = (testSuiteId: string) => {
    if (!config.testSuiteConfigs) {
      setConfig({ ...config, testSuiteConfigs: {} });
    }
    
    if (!config.testSuiteConfigs?.[testSuiteId]) {
      const defaultContentEval: any = {};
      contentEvaluation.forEach(score => {
        defaultContentEval[score.id] = {
          threshold: score.defaultThreshold,
        };
      });

      const defaultRetrievalGen: any = {};
      retrievalGeneration.forEach(score => {
        defaultRetrievalGen[score.id] = {
          threshold: score.defaultThreshold,
        };
      });

      const defaultFunctional: any = {};
      functionalTesting.forEach(score => {
        defaultFunctional[score.id] = {
          threshold: score.defaultThreshold,
        };
      });

      const defaultNonFunctional: any = {};
      nonFunctionalTesting.forEach(score => {
        defaultNonFunctional[score.id] = {
          threshold: score.defaultThreshold,
        };
      });
      
      const defaultConfig = {
        contentEvaluation: defaultContentEval,
        retrievalGeneration: defaultRetrievalGen,
        functionalTesting: defaultFunctional,
        nonFunctionalTesting: defaultNonFunctional,
      };
      
      setConfig({
        ...config,
        testSuiteConfigs: {
          ...config.testSuiteConfigs,
          [testSuiteId]: defaultConfig,
        },
      });
      
      setOriginalConfig(JSON.parse(JSON.stringify(defaultConfig)));
      setHasUnsavedChanges(false);
    }
  };

  useEffect(() => {
    if (selectedTestSuiteIdLocal) {
      fetchExistingConfiguration(selectedTestSuiteIdLocal);
      fetchTestRuns(selectedTestSuiteIdLocal);
    }
  }, [selectedTestSuiteIdLocal]);

  const getCurrentConfig = () => {
    return config.testSuiteConfigs?.[selectedTestSuiteIdLocal] || {};
  };

  const checkForChanges = (newConfig: any) => {
    return JSON.stringify(newConfig) !== JSON.stringify(originalConfig);
  };

  const updateScoreConfig = (category: string, scoreId: string, value: number) => {
    if (hasTestRuns) {
      toast({
        title: 'Thresholds Locked',
        description: 'Cannot modify thresholds after test runs have been executed.',
        variant: 'destructive',
      });
      return;
    }

    const currentConfig = getCurrentConfig();
    const newCategoryConfig = {
      ...currentConfig[category],
      [scoreId]: { threshold: value },
    };

    const newConfig = {
      ...currentConfig,
      [category]: newCategoryConfig,
    };

    const newFullConfig = {
      ...config,
      testSuiteConfigs: {
        ...config.testSuiteConfigs,
        [selectedTestSuiteIdLocal]: newConfig,
      },
    };

    setConfig(newFullConfig);
    setHasUnsavedChanges(checkForChanges(newConfig));
  };

  const saveConfiguration = async () => {
    try {
      const currentConfig = getCurrentConfig();
      
      // Convert frontend config to backend format
      const backendConfig: any = {
        selected_metrics: {},
      };

      Object.entries(currentConfig).forEach(([category, metrics]: [string, any]) => {
        const categoryName = category === 'contentEvaluation' ? 'content evaluation' :
                           category === 'retrievalGeneration' ? 'retrieval and generation evaluation' :
                           category === 'functionalTesting' ? 'functional testing' :
                           category === 'nonFunctionalTesting' ? 'non functional testing' : category;
        
        backendConfig.selected_metrics[categoryName] = {};
        
        Object.entries(metrics).forEach(([metricId, config]: [string, any]) => {
          const metricInfo = getAllMetrics().find(m => m.id === metricId);
          if (metricInfo) {
            backendConfig.selected_metrics[categoryName][metricInfo.name] = config.threshold / 100;
          }
        });
      });

      if (existingConfig) {
        const response = await updateConfiguration(selectedTestSuiteIdLocal, existingConfig.config_id, backendConfig);

        if (response.ok) {
          const updatedConfig = await response.json();
          setExistingConfig(updatedConfig);
          setOriginalConfig(JSON.parse(JSON.stringify(currentConfig)));
          setHasUnsavedChanges(false);
          toast({
            title: 'Configuration Updated',
            description: 'Threshold changes have been saved successfully.',
          });
          console.log('✅ Configuration saved successfully');
        } else {
          throw new Error('Failed to update configuration');
        }
      } else {
        const response = await createConfiguration(selectedTestSuiteIdLocal, backendConfig);

        

        if (response.ok) {
          const newConfig = await response.json();
          setExistingConfig(newConfig);
          setOriginalConfig(JSON.parse(JSON.stringify(currentConfig)));
          setHasUnsavedChanges(false);
          toast({
            title: 'Configuration Created',
            description: 'Threshold changes have been saved successfully.',
          });
          console.log('✅ Configuration saved successfully');
        } else {
          throw new Error('Failed to update configuration');
        }
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: 'Error',
        description: 'Failed to save configuration changes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Store the configuration in a way that ModelSelection can access it
  useEffect(() => {
    const currentConfig = getCurrentConfig();
    console.log('🔄 Storing configuration for ModelSelection:', currentConfig);
    
    setConfig({
      ...config,
      pendingConfiguration: {
        testSuiteId: selectedTestSuiteIdLocal,
        thresholds: currentConfig,
        isEditing: !!existingConfig,
        configId: existingConfig?.config_id,
      },
    });
  }, [selectedTestSuiteIdLocal, existingConfig, config.testSuiteConfigs]);

  const selectedTestSuite = testSuites.find(suite => suite.id === selectedTestSuiteIdLocal);

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
        {scores.map((score) => {
          const currentThreshold = currentConfig[category]?.[score.id]?.threshold ?? score.defaultThreshold;
          const isChanged = currentThreshold !== score.defaultThreshold;
          
          return (
            <Card key={score.id} className={`p-4 transform transition-all duration-300 hover:shadow-lg hover:scale-102 border-l-4 bg-card dark:bg-card/80 backdrop-blur-sm border-border dark:border-border/60 ${color.includes('indigo') ? 'border-l-indigo-500 dark:border-l-indigo-400' : color.includes('purple') ? 'border-l-purple-500 dark:border-l-purple-400' : color.includes('green') ? 'border-l-green-500 dark:border-l-green-400' : 'border-l-orange-500 dark:border-l-orange-400'}`}>
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium text-foreground text-left block">{score.name}</Label>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm text-muted-foreground">
                        Threshold: {currentThreshold}%
                        {isChanged && (
                          <span className="ml-2 text-xs text-blue-600 font-medium">
                            (Changed from {score.defaultThreshold}%)
                          </span>
                        )}
                      </Label>
                      {hasTestRuns && (
                        <div className="flex items-center gap-1 text-xs text-orange-600">
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>
                    <Slider
                      value={[currentThreshold]}
                      onValueChange={([value]) => updateScoreConfig(category, score.id, value)}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full mt-2"
                      disabled={hasTestRuns}
                    />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
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
            {hasUnsavedChanges && existingConfig && (
              <Button 
                onClick={saveConfiguration}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transform transition-all duration-200 hover:scale-105"
                disabled={hasTestRuns}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Suite Selection */}
          <div className="space-y-2">
            <Label className="text-foreground">Select Test Suite to Configure</Label>
            <Select
              value={selectedTestSuiteIdLocal}
              onValueChange={(value) => {
                setSelectedTestSuiteIdLocal(value);
                fetchExistingConfiguration(value);
                fetchTestRuns(value);
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
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground animate-fade-in">
                  Configuring: <span className="font-medium text-primary">{selectedTestSuite.name}</span>
                  {existingConfig && <span className="text-blue-600 ml-2">(Editing existing configuration)</span>}
                </p>
                {hasUnsavedChanges && (
                  <p className="text-xs text-orange-600 font-medium">
                    ⚠️ You have unsaved threshold changes. Save them or they will revert to previous values.
                  </p>
                )}
                {hasTestRuns && (
                  <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <div className="text-sm">
                      <p className="text-orange-800 dark:text-orange-200 font-medium">Thresholds Locked</p>
                      <p className="text-orange-700 dark:text-orange-300 text-xs">
                        This test suite has {testRuns.length} test run{testRuns.length !== 1 ? 's' : ''}. Thresholds cannot be modified after test execution.
                      </p>
                    </div>
                  </div>
                )}
              </div>
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
