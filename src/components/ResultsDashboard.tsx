
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Download } from "lucide-react";

interface ResultsDashboardProps {
  results: any;
  onNext: () => void;
  onBack: () => void;
}

const ResultsDashboard = ({ results, onNext, onBack }: ResultsDashboardProps) => {
  if (!results) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overall Score Card */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Overall Evaluation Score
          </CardTitle>
          <div className="text-4xl font-bold text-blue-900 mt-2">
            {results.overall_score}%
          </div>
          <CardDescription>
            Comprehensive performance evaluation of OrionAI
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(results.metrics).map(([key, metric]: [string, any]) => (
          <Card key={key} className={`border ${getStatusColor(metric.status)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold capitalize">
                  {key.replace('_', ' ')}
                </h3>
                {getStatusIcon(metric.status)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score:</span>
                  <span className="font-medium">{metric.score}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Threshold:</span>
                  <span>{metric.threshold}%</span>
                </div>
                <Progress 
                  value={metric.score} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Results */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Execution Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span>Total Tests:</span>
                  <span className="font-medium">{results.detailed_results.total_tests}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Passed:</span>
                  <span className="font-medium text-green-600">{results.detailed_results.passed}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Warnings:</span>
                  <span className="font-medium text-yellow-600">{results.detailed_results.warnings}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Failed:</span>
                  <span className="font-medium text-red-600">{results.detailed_results.failed}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Execution Time:</span>
                  <span className="font-medium">{results.execution_time}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-green-700">
                      <strong>Strong Performance</strong> in answer relevancy and hallucination control
                    </p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm text-yellow-700">
                      <strong>Areas for Improvement</strong> in correctness and contextual relevance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>
                In-depth breakdown of evaluation results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(results.metrics).map(([key, metric]: [string, any]) => (
                <div key={key} className="p-4 border rounded-lg">
                  <h4 className="font-semibold capitalize mb-3">{key.replace('_', ' ')} Analysis</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Current Score</p>
                      <p className="text-2xl font-bold">{metric.score}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Target Threshold</p>
                      <p className="text-2xl font-bold">{metric.threshold}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(metric.status)}
                        <span className="capitalize font-medium">{metric.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={metric.score} className="h-3" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Improvement Recommendations</CardTitle>
              <CardDescription>
                Actionable insights to enhance OrionAI performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
                <h4 className="font-semibold text-yellow-800">Correctness (94.2% - Target: 95%)</h4>
                <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                  <li>• Review and expand training data for edge cases</li>
                  <li>• Implement additional fact-checking mechanisms</li>
                  <li>• Consider ensemble methods for improved accuracy</li>
                </ul>
              </div>

              <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
                <h4 className="font-semibold text-yellow-800">Contextual Relevance (91.5% - Target: 95%)</h4>
                <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                  <li>• Enhance context window processing capabilities</li>
                  <li>• Improve attention mechanisms for better context understanding</li>
                  <li>• Add context validation layers</li>
                </ul>
              </div>

              <div className="p-4 border-l-4 border-green-400 bg-green-50">
                <h4 className="font-semibold text-green-800">Strong Areas to Maintain</h4>
                <ul className="mt-2 text-sm text-green-700 space-y-1">
                  <li>• Answer Relevancy (96.8%) - Excellent performance</li>
                  <li>• Hallucination Control (3.1%) - Well below threshold</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
          Generate Report <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
