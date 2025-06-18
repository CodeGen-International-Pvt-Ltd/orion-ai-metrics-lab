import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, AlertCircle, CheckCircle, Clock, BarChart3, Loader2 } from "lucide-react";

interface TestRun {
  test_run_id: number;
  test_suite: number;
  test_run_date: string;
  execution_status: string;
  total_time: string | null;
  evaluation: any;
  test_results: any[];
}

interface TestRunsDisplayProps {
  testSuiteName: string;
  testSuiteId: number;
  onSelectTestRun: (runId: number) => void;
  onBack: () => void;
}

const TestRunsDisplay = ({ testSuiteName, testSuiteId, onSelectTestRun, onBack }: TestRunsDisplayProps) => {
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestRuns();
  }, [testSuiteId]);

  const fetchTestRuns = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/test-suite/${testSuiteId}/test-run/filter/`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch test runs: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Fetched ${data.length} test runs for suite ${testSuiteId}:`, data);
      
      // Sort by date (newest first)
      const sortedRuns = Array.isArray(data) ? data.sort((a: TestRun, b: TestRun) => 
        new Date(b.test_run_date).getTime() - new Date(a.test_run_date).getTime()
      ) : [];
      
      setTestRuns(sortedRuns);
    } catch (err) {
      console.error('Error fetching test runs:', err);
      setError('Failed to load test runs');
    } finally {
      setLoading(false);
    }
  };

  const getRunStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { status: 'completed', icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Completed' };
      case 'running':
        return { status: 'running', icon: Clock, color: 'bg-blue-100 text-blue-700', label: 'Running' };
      case 'failed':
        return { status: 'failed', icon: AlertCircle, color: 'bg-red-100 text-red-700', label: 'Failed' };
      default:
        return { status: 'unknown', icon: AlertCircle, color: 'bg-gray-100 text-gray-700', label: status };
    }
  };

  const formatRunTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
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
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading test runs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto text-red-600 mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchTestRuns} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testRuns.map((run, index) => {
            const status = getRunStatus(run.execution_status);
            const StatusIcon = status.icon;
            const isLatest = index === 0; // First item is latest since we sorted by date
            
            return (
              <Card 
                key={run.test_run_id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onSelectTestRun(run.test_run_id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Play className="w-8 h-8 text-blue-600" />
                    <div className="flex gap-2">
                      {isLatest && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          Latest
                        </Badge>
                      )}
                      <Badge variant="outline" className={status.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Test Run #{run.test_run_id}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatRunTime(run.test_run_date)}
                      </div>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Execution Time */}
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {run.total_time || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">Execution Time</div>
                    </div>

                    {/* Test Results Count */}
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {run.test_results?.length || 0}
                      </div>
                      <div className="text-xs text-gray-500">Test Results</div>
                    </div>

                    {/* Evaluation Score (if available) */}
                    {run.evaluation && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {run.evaluation.overall_score || 'N/A'}%
                        </div>
                        <div className="text-xs text-gray-500">Overall Score</div>
                      </div>
                    )}

                    {/* Click to view details */}
                    <div className="text-center pt-2 border-t">
                      <p className="text-xs text-gray-500">Click to view details</p>
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
