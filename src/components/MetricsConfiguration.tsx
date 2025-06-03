
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, BarChart3, ArrowRight, Save, ArrowLeft, Target, Zap, Award } from "lucide-react";
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

  const predefinedMetrics = [
    { id: 'correctness', name: 'Correctness', defaultThreshold: 95, description: 'Accuracy of responses', defaultEnabled: true, icon: Target },
    { id: 'relevance', name: 'Relevance', defaultThreshold: 90, description: 'Relevance to the query', defaultEnabled: true, icon: Target },
    { id: 'coherence', name: 'Coherence', defaultThreshold: 85, description: 'Logical flow and consistency', defaultEnabled: true, icon: Award },
    { id: 'fluency', name: 'Fluency', defaultThreshold: 88, description: 'Language quality and readability', defaultEnabled: false, icon: Zap },
    { id: 'groundedness', name: 'Groundedness', defaultThreshold: 92, description: 'Factual accuracy and grounding', defaultEnabled: true, icon: Target },
    { id: 'diversity', name: 'Diversity', defaultThreshold: 75, description: 'Response variation and creativity', defaultEnabled: false, icon: Award }
  ];

  const evaluationTypes = [
    { id: 'nlg', name: 'Natural Language Generation', description: 'For text generation tasks', defaultEnabled: true },
    { id: 'qa', name: 'Question Answering', description: 'For Q&A systems', defaultEnabled: true },
    { id: 'summarization', name: 'Text Summarization', description: 'For summarization tasks', defaultEnabled: false },
    { id: 'translation', name: 'Machine Translation', description: 'For translation tasks', defaultEnabled: false },
    { id: 'classification', name: 'Text Classification', description: 'For classification tasks', defaultEnabled: false },
    { id: 'sentiment', name: 'Sentiment Analysis', description: 'For sentiment detection', defaultEnabled: false }
  ];

  const scoringMethods = [
    'BLEU', 'ROUGE-1', 'ROUGE-2', 'ROUGE-L', 'METEOR', 'BERTScore', 'BLEURT', 'COMET',
    'BERT', 'BART', 'DistilBERT', 'RoBERTa', 'BLEURT', 'G-Eval', 'BERTScore', 'SPICE', 'WMD', 'ELMO'
  ];

  const initializeDefaults = (testSuiteId: string) => {
    if (!config.testSuiteConfigs) {
      setConfig({ ...config, testSuiteConfigs: {} });
    }

    if (!config.testSuiteConfigs[testSuiteId]) {
      const defaultMetrics = {};
      predefinedMetrics.forEach(metric => {
        defaultMetrics[metric.id] = {
          enabled: metric.defaultEnabled,
          threshold: metric.defaultThreshold
        };
      });

      const defaultEvaluationTypes = {};
      evaluationTypes.forEach(type => {
        defaultEvaluationTypes[type.id] = type.defaultEnabled;
      });

      setConfig({
        ...config,
        testSuiteConfigs: {
          ...config.testSuiteConfigs,
          [testSuiteId]: {
            metrics: defaultMetrics,
            evaluationTypes: defaultEvaluationTypes,
            scoringMethods: ['BLEU', 'ROUGE-L', 'BERTScore']
          }
        }
      });
    }
  };

  useState(() => {
    if (selectedTestSuiteId) {
      initializeDefaults(selectedTestSuiteId);
    }
  });

  const selectedTestSuite = testSuites.find(suite => suite.id === selectedTestSuiteId);
  const currentConfig = config.testSuiteConfigs?.[selectedTestSuiteId] || {
    metrics: {},
    evaluationTypes: {},
    scoringMethods: []
  };

  const updateMetric = (metricId: string, field: string, value: any) => {
    setConfig({
      ...config,
      testSuiteConfigs: {
        ...config.testSuiteConfigs,
        [selectedTestSuiteId]: {
          ...currentConfig,
          metrics: {
            ...currentConfig.metrics,
            [metricId]: {
              ...currentConfig.metrics?.[metricId],
              [field]: value
            }
          }
        }
      }
    });
  };

  const updateEvaluationType = (typeId: string, enabled: boolean) => {
    setConfig({
      ...config,
      testSuiteConfigs: {
        ...config.testSuiteConfigs,
        [selectedTestSuiteId]: {
          ...currentConfig,
          evaluationTypes: {
            ...currentConfig.evaluationTypes,
            [typeId]: enabled
          }
        }
      }
    });
  };

  const updateScoringMethod = (method: string, enabled: boolean) => {
    const currentMethods = currentConfig.scoringMethods || [];
    const updatedMethods = enabled 
      ? [...currentMethods, method]
      : currentMethods.filter(m => m !== method);

    setConfig({
      ...config,
      testSuiteConfigs: {
        ...config.testSuiteConfigs,
        [selectedTestSuiteId]: {
          ...currentConfig,
          scoringMethods: updatedMethods
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

  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Metrics Configuration</h2>
          <p className="text-slate-600 text-lg">Configure evaluation metrics and thresholds for comprehensive AI performance testing</p>
        </div>
        <Button 
          onClick={handleSaveConfiguration}
          disabled={isSaving || !selectedTestSuiteId}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="w-5 h-5 mr-2" />
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>

      {/* Test Suite Selection */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="text-xl text-slate-900">Select Test Suite</CardTitle>
          <CardDescription>Choose the test suite to configure evaluation metrics for</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Select value={selectedTestSuiteId} onValueChange={setSelectedTestSuiteId}>
            <SelectTrigger className="w-full h-12 text-lg border-slate-300 rounded-xl">
              <SelectValue placeholder="Select a test suite to configure" />
            </SelectTrigger>
            <SelectContent>
              {testSuites.map((suite) => (
                <SelectItem key={suite.id} value={suite.id} className="text-lg py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{suite.name}</span>
                    <span className="text-sm text-slate-500">{suite.testCases?.length || 0} test cases</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedTestSuiteId && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
            <CardTitle className="text-xl text-slate-900 flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              Configuration for {selectedTestSuite?.name}
            </CardTitle>
            <CardDescription>Fine-tune evaluation parameters for optimal performance assessment</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="metrics" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 m-6 mb-0 rounded-xl">
                <TabsTrigger value="metrics" className="text-base py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Target className="w-4 h-4 mr-2" />
                  Core Metrics
                </TabsTrigger>
                <TabsTrigger value="evaluation" className="text-base py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Evaluation Types
                </TabsTrigger>
                <TabsTrigger value="scoring" className="text-base py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Award className="w-4 h-4 mr-2" />
                  Scoring Methods
                </TabsTrigger>
              </TabsList>

              <TabsContent value="metrics" className="p-6 space-y-6">
                <div className="grid gap-6">
                  {predefinedMetrics.map((metric) => {
                    const Icon = metric.icon;
                    const metricConfig = currentConfig.metrics?.[metric.id] || { enabled: metric.defaultEnabled, threshold: metric.defaultThreshold };
                    
                    return (
                      <Card key={metric.id} className={`border-2 transition-all duration-300 ${metricConfig.enabled ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200'}`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metricConfig.enabled ? 'bg-blue-600' : 'bg-slate-400'}`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-slate-900">{metric.name}</h4>
                                <p className="text-slate-600">{metric.description}</p>
                              </div>
                            </div>
                            <Switch
                              checked={metricConfig.enabled}
                              onCheckedChange={(checked) => updateMetric(metric.id, 'enabled', checked)}
                              className="scale-125"
                            />
                          </div>
                          {metricConfig.enabled && (
                            <div className="space-y-4 pl-16">
                              <div>
                                <Label className="text-base font-medium text-slate-700 mb-3 block">
                                  Threshold: {metricConfig.threshold}%
                                </Label>
                                <Slider
                                  value={[metricConfig.threshold]}
                                  onValueChange={(value) => updateMetric(metric.id, 'threshold', value[0])}
                                  max={100}
                                  step={1}
                                  className="w-full"
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="evaluation" className="p-6">
                <div className="grid gap-4">
                  {evaluationTypes.map((type) => (
                    <Card key={type.id} className={`border-2 transition-all duration-300 ${currentConfig.evaluationTypes?.[type.id] ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200'}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900 mb-1">{type.name}</h4>
                            <p className="text-slate-600">{type.description}</p>
                          </div>
                          <Switch
                            checked={currentConfig.evaluationTypes?.[type.id] || false}
                            onCheckedChange={(checked) => updateEvaluationType(type.id, checked)}
                            className="scale-125"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="scoring" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scoringMethods.map((method) => (
                    <Card key={method} className={`border-2 transition-all duration-300 cursor-pointer ${currentConfig.scoringMethods?.includes(method) ? 'border-purple-200 bg-purple-50/30' : 'border-slate-200'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900">{method}</span>
                          <Switch
                            checked={currentConfig.scoringMethods?.includes(method) || false}
                            onCheckedChange={(checked) => updateScoringMethod(method, checked)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="px-8 py-3 text-lg rounded-xl border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to Test Suites
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!selectedTestSuiteId}
          className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Continue to Model Selection
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default MetricsConfiguration;
