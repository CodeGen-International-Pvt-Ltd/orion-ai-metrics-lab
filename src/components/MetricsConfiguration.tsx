import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Settings, ArrowRight, Save, Edit2, Trash2 } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [existingConfigs, setExistingConfigs] = useState([]);
  const [editingConfigId, setEditingConfigId] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState('https://api.example.com/process');
  const [directory, setDirectory] = useState('C:/Users/Downloads/ML-viva');
  const [excelOutputPath, setExcelOutputPath] = useState('C:/Users/Downloads');
  const { toast } = useToast();

  // Define all available metrics with default thresholds
  const allMetrics = [
    { id: 'BLEU', name: 'BLEU', defaultThreshold: 0.8 },
    { id: 'ROUGE', name: 'ROUGE', defaultThreshold: 0.7 },
    { id: 'NLI', name: 'NLI', defaultThreshold: 0.5 },
    { id: 'BLEURT', name: 'BLEURT', defaultThreshold: 0.7 },
    { id: 'G-Eval', name: 'G-Eval', defaultThreshold: 0.6 },
    { id: 'BERTScore', name: 'BERTScore', defaultThreshold: 0.75 },
    { id: 'SPICE', name: 'SPICE', defaultThreshold: 0.6 },
    { id: 'WMD', name: 'WMD', defaultThreshold: 0.5 },
    { id: 'ELMO', name: 'ELMO', defaultThreshold: 0.5 },
    { id: 'METEOR', name: 'METEOR', defaultThreshold: 0.7 },
    { id: 'Levenshtein distance', name: 'Levenshtein Distance', defaultThreshold: 0.8 },
    { id: 'R-Precision', name: 'R-Precision', defaultThreshold: 0.75 }
  ];

  const [metricThresholds, setMetricThresholds] = useState(() => {
    const thresholds = {};
    allMetrics.forEach(metric => {
      thresholds[metric.id] = metric.defaultThreshold;
    });
    return thresholds;
  });

  useEffect(() => {
    if (selectedTestSuiteId) {
      fetchExistingConfigurations();
    }
  }, [selectedTestSuiteId]);

  const fetchExistingConfigurations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/test-suite/${selectedTestSuiteId}/configurations/`);
      if (response.ok) {
        const configs = await response.json();
        setExistingConfigs(configs);
      }
    } catch (error) {
      console.error('Error fetching configurations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    
    const selectedTestSuite = testSuites.find(suite => suite.id === selectedTestSuiteId);
    const selectedMetrics = allMetrics.map(metric => metric.id);
    const selectedThresholds = allMetrics.map(metric => metricThresholds[metric.id]);
    
    const payload = {
      suite_type: selectedTestSuite?.type || 'excel',
      api_endpoint: apiEndpoint,
      selected_metrics: selectedMetrics,
      selected_thresholds: selectedThresholds,
      directory: directory,
      excel_output_path: excelOutputPath,
      model_selected: config.selectedModel || 'openai'
    };

    try {
      const url = editingConfigId 
        ? `http://127.0.0.1:8000/test-suite/${selectedTestSuiteId}/configurations/${editingConfigId}/`
        : `http://127.0.0.1:8000/test-suite/${selectedTestSuiteId}/configurations/`;
      
      const method = editingConfigId ? 'PUT' : 'POST';
      const requestBody = editingConfigId 
        ? { selected_metrics: selectedMetrics, selected_thresholds: selectedThresholds }
        : payload;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      const data = await response.json();
      console.log('Configuration saved:', data);
      
      // Update local config state
      setConfig({
        ...config,
        configurationId: data.config_id,
        selectedMetrics: selectedMetrics,
        selectedThresholds: selectedThresholds,
        apiEndpoint: apiEndpoint,
        directory: directory,
        excelOutputPath: excelOutputPath
      });

      toast({
        title: editingConfigId ? "Configuration Updated" : "Configuration Saved",
        description: `Settings for ${selectedTestSuite?.name} have been ${editingConfigId ? 'updated' : 'saved'} successfully.`,
      });

      setEditingConfigId(null);
      fetchExistingConfigurations();
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditConfiguration = (configData) => {
    setEditingConfigId(configData.config_id);
    
    // Load the configuration data into the form
    const newThresholds = {};
    configData.selected_metrics.forEach((metric, index) => {
      newThresholds[metric] = configData.selected_thresholds[index];
    });
    setMetricThresholds(newThresholds);
    setApiEndpoint(configData.api_endpoint);
    setDirectory(configData.directory);
    setExcelOutputPath(configData.excel_output_path);
  };

  const handleDeleteConfiguration = async (configId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/configurations/${configId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete configuration');
      }

      toast({
        title: "Configuration Deleted",
        description: "Configuration has been deleted successfully.",
      });

      fetchExistingConfigurations();
    } catch (error) {
      console.error('Error deleting configuration:', error);
      toast({
        title: "Error",
        description: "Failed to delete configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateMetricThreshold = (metricId: string, value: number) => {
    setMetricThresholds(prev => ({
      ...prev,
      [metricId]: value / 100 // Convert percentage to decimal
    }));
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
                Configure metric thresholds and save configurations for your test suites
              </CardDescription>
            </div>
            <Button 
              onClick={handleSaveConfiguration}
              disabled={isSaving || !selectedTestSuiteId}
              className="bg-primary hover:bg-primary/90 text-primary-foreground transform transition-all duration-200 hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : editingConfigId ? 'Update Configuration' : 'Save Configuration'}
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
                setEditingConfigId(null);
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

          {/* Configuration Settings */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apiEndpoint">API Endpoint</Label>
              <Input
                id="apiEndpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://api.example.com/process"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="directory">Directory</Label>
              <Input
                id="directory"
                value={directory}
                onChange={(e) => setDirectory(e.target.value)}
                placeholder="C:/Users/Downloads/ML-viva"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excelOutputPath">Excel Output Path</Label>
              <Input
                id="excelOutputPath"
                value={excelOutputPath}
                onChange={(e) => setExcelOutputPath(e.target.value)}
                placeholder="C:/Users/Downloads"
              />
            </div>
          </div>

          {/* Existing Configurations */}
          {existingConfigs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Existing Configurations</h3>
              <div className="grid gap-3">
                {existingConfigs.map((configData) => (
                  <div key={configData.config_id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div>
                      <h4 className="font-medium">Configuration #{configData.config_id}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Model: {configData.model_selected} | Metrics: {configData.selected_metrics.length}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditConfiguration(configData)}
                        className="gap-2"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteConfiguration(configData.config_id)}
                        className="gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics Configuration */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Metric Thresholds</h3>
            <p className="text-sm text-muted-foreground">All metrics are automatically selected. Adjust thresholds as needed (values are in decimals from 0.0 to 1.0).</p>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {allMetrics.map((metric) => (
                <Card key={metric.id} className="p-4 transform transition-all duration-300 hover:shadow-lg hover:scale-102 border-l-4 bg-card dark:bg-card/80 backdrop-blur-sm border-border dark:border-border/60 border-l-blue-500 dark:border-l-blue-400">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium text-foreground text-left block">{metric.name}</Label>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm text-muted-foreground">
                            Threshold: {(metricThresholds[metric.id] * 100).toFixed(1)}%
                          </Label>
                        </div>
                        <Slider
                          value={[metricThresholds[metric.id] * 100]}
                          onValueChange={([value]) => updateMetricThreshold(metric.id, value)}
                          min={0}
                          max={100}
                          step={0.1}
                          className="w-full mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
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
