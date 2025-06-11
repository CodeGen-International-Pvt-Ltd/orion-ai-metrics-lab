
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, AlertCircle, CheckCircle, Clock, BarChart3 } from "lucide-react";

interface TestRun {
  id: string;
  timestamp: string;
  overall_score: number;
  detailed_results: {
    total_tests: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  execution_time: string;
}

interface TestRunsDisplayProps {
  testSuiteName: string;
  testRuns: TestRun[];
  onSelectTestRun: (runId: string) => void;
  onBack: () => void;
}

const TestRunsDisplay = ({ testSuiteName, testRuns, onSelectTestRun, onBack }: TestRunsDisplayProps) => {
  const getRunStatus = (score: number) => {
    if (score >= 95) {
      return { status: 'excellent', icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Excellent' };
    } else if (score >= 85) {
      return { status: 'good', icon: CheckCircle, color: 'bg-blue-100 text-blue-700', label: 'Good' };
    } else if (score >= 70) {
      return { status: 'warning', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700', label: 'Needs Improvement' };
    } else {
      return { status: 'poor', icon: AlertCircle, color: 'bg-red-100 text-red-700', label: 'Poor' };
    }
  };

  const formatRunTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
  Test Runs for "{testSuiteName}"
</h1>

          <p className="text-gray-600 mt-2">View all test runs and their results for this test suite</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Test Suites
        </Button>
      </div>

      {testRuns.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Test Runs Yet</h3>
            <p className="text-gray-600 mb-6">This test suite hasn't been executed yet</p>
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
              Run Tests
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {testRuns.map((run, index) => {
            const status = getRunStatus(run.overall_score);
            const StatusIcon = status.icon;
            const isLatest = index === testRuns.length - 1;
            
            return (
              <Card 
                key={run.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onSelectTestRun(run.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <Play className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Test Run #{testRuns.length - index}
                            {isLatest && (
                              <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">
                                Latest
                              </Badge>
                            )}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatRunTime(run.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Overall Score */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{run.overall_score}%</div>
                        <div className="text-xs text-gray-500">Overall Score</div>
                      </div>

                      {/* Test Results */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600">{run.detailed_results.passed}</div>
                          <div className="text-xs text-gray-500">Passed</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-600">{run.detailed_results.failed}</div>
                          <div className="text-xs text-gray-500">Failed</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-yellow-600">{run.detailed_results.warnings}</div>
                          <div className="text-xs text-gray-500">Warnings</div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center">
                        <Badge variant="outline" className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>

                      {/* Execution Time */}
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">{run.execution_time}</div>
                        <div className="text-xs text-gray-500">Execution Time</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TestRunsDisplay;
