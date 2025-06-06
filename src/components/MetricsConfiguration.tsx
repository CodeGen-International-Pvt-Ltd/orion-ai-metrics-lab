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

  // Define metric color logic based on their nature
  const getMetricColor = (metricId: string, value: number) => {
    // For inverted metrics (lower is better)
    const invertedMetrics = ['hallucination'];
    
    if (invertedMetrics.some(metric => metricId.toLowerCase().includes(metric))) {
      // For hallucination: lower is better
      if (value <= 10) return "bg-emerald-600"; // Very low hallucination - excellent
      if (value <= 20) return "bg-green-500"; // Low hallucination - good
      if (value <= 30) return "bg-lime-500"; // Moderate hallucination - acceptable
      if (value <= 40) return "bg-yellow-500"; // High hallucination - concerning
      if (value <= 60) return "bg-orange-500"; // Very high hallucination - poor
      if (value <= 80) return "bg-red-400"; // Extremely high - bad
      return "bg-red-600"; // Critical levels
    }
    
    // For fluency, conciseness, relevance - moderate to high is good
    if (['fluency', 'conciseness', 'relevance'].some(metric => metricId.toLowerCase().includes(metric))) {
      if (value >= 85) return "bg-emerald-600"; // Excellent
      if (value >= 75) return "bg-green-500"; // Good
      if (value >= 65) return "bg-lime-500"; // Acceptable
      if (value >= 55) return "bg-yellow-500"; // Needs improvement
      if (value >= 45) return "bg-orange-500"; // Poor
      if (value >= 35) return "bg-red-400"; // Bad
      return "bg-red-600"; // Very bad
    }
    
    // For correctness - high standards required
    if (metricId.toLowerCase().includes('correctness')) {
      if (value >= 90) return "bg-emerald-600"; // Excellent
      if (value >= 80) return "bg-green-500"; // Good
      if (value >= 70) return "bg-yellow-500"; // Acceptable but concerning
      if (value >= 60) return "bg-orange-500"; // Poor
      if (value >= 50) return "bg-red-400"; // Bad
      return "bg-red-600"; // Very bad
    }
    
    // For NLI, BLEURT (high precision metrics)
    if (['nli', 'bleurt', 'bart', 'roberta'].some(metric => metricId.toLowerCase().includes(metric))) {
      if (value >= 85) return "bg-emerald-600"; // Excellent
      if (value >= 75) return "bg-green-500"; // Good
      if (value >= 65) return "bg-lime-500"; // Acceptable
      if (value >= 55) return "bg-yellow-500"; // Needs improvement
      if (value >= 45) return "bg-orange-500"; // Poor
      return "bg-red-400"; // Bad
    }
    
    // For statistical metrics (ROUGE, BLEU, METEOR) - generally lower thresholds acceptable
    if (['rouge', 'bleu', 'meteor'].some(metric => metricId.toLowerCase().includes(metric))) {
      if (value >= 80) return "bg-emerald-600"; // Excellent
      if (value >= 70) return "bg-green-500"; // Good
      if (value >= 60) return "bg-lime-500"; // Acceptable
      if (value >= 50) return "bg-yellow-500"; // Fair
      if (value >= 40) return "bg-orange-500"; // Poor
      if (value >= 30) return "bg-red-400"; // Bad
      return "bg-red-600"; // Very bad
    }
    
    // Default color scheme for other metrics
    if (value >= 85) return "bg-emerald-600";
    if (value >= 75) return "bg-green-500";
    if (value >= 65) return "bg-lime-500";
    if (value >= 55) return "bg-yellow-500";
    if (value >= 45) return "bg-orange-500";
    if (value >= 35) return "bg-red-400";
    return "bg-red-600";
  };

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
      <Card className="transform transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Metrics Configuration
              </CardTitle>
              <CardDescription>
                Configure scoring methods and thresholds for your test suites
              </CardDescription>
            </div>
            <Button 
              onClick={handleSaveConfiguration}
              disabled={isSaving || !selectedTestSuiteId}
              className="bg-green-600 hover:bg-green-700 transform transition-all duration-200 hover:scale-105"
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
              <SelectTrigger className="transform transition-all duration-200 hover:scale-102">
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
              <p className="text-sm text-gray-600 animate-fade-in">
                Configuring: <span className="font-medium text-blue-600">{selectedTestSuite.name}</span>
              </p>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Scoring Methods</h3>
            <p className="text-sm text-gray-600">All scoring methods are automatically selected with default thresholds. You can adjust thresholds as needed.</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Model Based Scores */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold mb-4 text-indigo-700">Model Based Scoring</h4>
                <div className="space-y-4">
                  {modelBasedScores.map((score) => (
                    <Card key={score.id} className="p-4 transform transition-all duration-300 hover:shadow-lg hover:scale-102 border-l-4 border-l-indigo-500">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium text-gray-800">{score.name}</Label>
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="text-sm text-gray-600">Threshold: {currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold}%</Label>
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                getMetricColor(score.id, currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold).includes('emerald') ? 'bg-emerald-100 text-emerald-800' :
                                getMetricColor(score.id, currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold).includes('green') ? 'bg-green-100 text-green-800' :
                                getMetricColor(score.id, currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold).includes('lime') ? 'bg-lime-100 text-lime-800' :
                                getMetricColor(score.id, currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold).includes('yellow') ? 'bg-yellow-100 text-yellow-800' :
                                getMetricColor(score.id, currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold).includes('orange') ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {getMetricColor(score.id, currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold).includes('emerald') ? 'Excellent' :
                                 getMetricColor(score.id, currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold).includes('green') ? 'Good' :
                                 getMetricColor(score.id, currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold).includes('lime') ? 'Fair' :
                                 getMetricColor(score.id, currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold).includes('yellow') ? 'Warning' :
                                 getMetricColor(score.id, currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold).includes('orange') ? 'Poor' : 'Critical'}
                              </div>
                            </div>
                            <Progress 
                              value={currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold} 
                              variant="score" 
                              className="h-3 animate-fade-in" 
                            />
                            <Slider
                              value={[currentConfig.modelBasedScores?.[score.id]?.threshold ?? score.defaultThreshold]}
                              onValueChange={([value]) => updateScoreConfig('modelBasedScores', score.id, value)}
                              min={0}
                              max={100}
                              step={1}
                              className="w-full mt-2"
                            />
                          </div>
                        </div>
                        
                        {score.subScores && (
                          <div className="pl-4 border-l-2 border-gray-200 space-y-3 animate-fade-in">
                            {score.subScores.map((subScore) => {
                              const subScoreKey = `${score.id}_${subScore.id}`;
                              const threshold = currentConfig.modelBasedScores?.[subScoreKey]?.threshold ?? subScore.defaultThreshold;
                              return (
                                <div key={subScore.id} className="transform transition-all duration-200 hover:scale-102">
                                  <Label className="text-sm font-medium text-gray-700">{subScore.name}</Label>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex justify-between items-center">
                                      <Label className="text-xs text-gray-600">Threshold: {threshold}%</Label>
                                      <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                        getMetricColor(subScore.id, threshold).includes('emerald') ? 'bg-emerald-100 text-emerald-700' :
                                        getMetricColor(subScore.id, threshold).includes('green') ? 'bg-green-100 text-green-700' :
                                        getMetricColor(subScore.id, threshold).includes('lime') ? 'bg-lime-100 text-lime-700' :
                                        getMetricColor(subScore.id, threshold).includes('yellow') ? 'bg-yellow-100 text-yellow-700' :
                                        getMetricColor(subScore.id, threshold).includes('orange') ? 'bg-orange-100 text-orange-700' :
                                        'bg-red-100 text-red-700'
                                      }`}>
                                        {getMetricColor(subScore.id, threshold).includes('emerald') ? 'Excellent' :
                                         getMetricColor(subScore.id, threshold).includes('green') ? 'Good' :
                                         getMetricColor(subScore.id, threshold).includes('lime') ? 'Fair' :
                                         getMetricColor(subScore.id, threshold).includes('yellow') ? 'Warning' :
                                         getMetricColor(subScore.id, threshold).includes('orange') ? 'Poor' : 'Critical'}
                                      </div>
                                    </div>
                                    <Progress 
                                      value={threshold} 
                                      variant="score" 
                                      className="h-2" 
                                    />
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
              <div className="space-y-4">
                <h4 className="text-lg font-semibold mb-4 text-purple-700">Statistical Scoring</h4>
                <div className="space-y-4">
                  {statisticalScores.map((score) => {
                    const threshold = currentConfig.statisticalScores?.[score.id]?.threshold ?? score.defaultThreshold;
                    return (
                      <Card key={score.id} className="p-4 transform transition-all duration-300 hover:shadow-lg hover:scale-102 border-l-4 border-l-purple-500">
                        <div>
                          <Label className="text-base font-medium text-gray-800">{score.name}</Label>
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="text-sm text-gray-600">Threshold: {threshold}%</Label>
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                getMetricColor(score.id, threshold).includes('emerald') ? 'bg-emerald-100 text-emerald-800' :
                                getMetricColor(score.id, threshold).includes('green') ? 'bg-green-100 text-green-800' :
                                getMetricColor(score.id, threshold).includes('lime') ? 'bg-lime-100 text-lime-800' :
                                getMetricColor(score.id, threshold).includes('yellow') ? 'bg-yellow-100 text-yellow-800' :
                                getMetricColor(score.id, threshold).includes('orange') ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {getMetricColor(score.id, threshold).includes('emerald') ? 'Excellent' :
                                 getMetricColor(score.id, threshold).includes('green') ? 'Good' :
                                 getMetricColor(score.id, threshold).includes('lime') ? 'Fair' :
                                 getMetricColor(score.id, threshold).includes('yellow') ? 'Warning' :
                                 getMetricColor(score.id, threshold).includes('orange') ? 'Poor' : 'Critical'}
                              </div>
                            </div>
                            <Progress 
                              value={threshold} 
                              variant="score" 
                              className="h-3 animate-fade-in" 
                            />
                            <Slider
                              value={[threshold]}
                              onValueChange={([value]) => updateScoreConfig('statisticalScores', score.id, value)}
                              min={0}
                              max={100}
                              step={1}
                              className="w-full mt-2"
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
        <Button variant="outline" onClick={onBack} className="transform transition-all duration-200 hover:scale-105">
          Back
        </Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 transform transition-all duration-200 hover:scale-105">
          Continue to Model Selection <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MetricsConfiguration;
