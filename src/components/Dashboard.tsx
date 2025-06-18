import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, AlertCircle, CheckCircle, Clock, BarChart3, FileText, Loader2 } from "lucide-react";

interface TestRun {
  test_run_id: number;
  test_suite: number;
  test_run_date: string;
  execution_status: string;
  total_time: string | null;
  evaluation: any;
  test_results: any[];
}

interface TestSuite {
  id: number;
  name: string;
  type: string;
}

interface DashboardProps {
  testSuites: TestSuite[];
  onSelectTestRun: (runId: number) => void;
  onSelectTestSuite: (suiteId: number) => void;
}

const Dashboard = ({ testSuites, onSelectTestRun, onSelectTestSuite }: DashboardProps) => {
  const [allTestRuns, setAllTestRuns] = useState<TestRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllTestRuns();
  }, [testSuites]);

  const fetchAllTestRuns = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const allRuns: TestRun[] = [];
      
      // Fetch test runs for each test suite
      for (const suite of testSuites) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/test-suite/${suite.id}/test-run/filter/`);
          
          if (!response.ok) {
            console.warn(`Failed to fetch test runs for suite ${suite.id}:`, response.status);
            continue;
          }
          
          const data = await response.json();
          if (Array.isArray(data)) {
            // Add test suite information to each test run
            const runsWithSuiteInfo = data.map((run: TestRun) => ({
              ...run,
              test_suite_name: suite.name,
              test_suite_type: suite.type
            }));
            allRuns.push(...runsWithSuiteInfo);
          }
        } catch (err) {
          console.error(`Error fetching test runs for suite ${suite.id}:`, err);
        }
      }
      
      // Sort by date (newest first)
      allRuns.sort((a, b) => new Date(b.test_run_date).getTime() - new Date(a.test_run_date).getTime());
      
      setAllTestRuns(allRuns);
    } catch (err) {
      console.error('Error fetching all test runs:', err);
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

  const getTestSuiteById = (suiteId: number) => {
    return testSuites.find(suite => suite.id === suiteId);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
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
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto text-red-600 mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchAllTestRuns} variant="outline">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of all test runs across all test suites</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{allTestRuns.length}</div>
            <div className="text-sm text-gray-500">Total Test Runs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {allTestRuns.filter(run => run.execution_status === 'Completed').length}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
        </div>
      </div>

      {allTestRuns.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Test Runs Found</h3>
            <p className="text-gray-600 mb-6">No test runs have been executed yet across all test suites</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {allTestRuns.map((run) => {
            const status = getRunStatus(run.execution_status);
            const StatusIcon = status.icon;
            const testSuite = getTestSuiteById(run.test_suite);
            
            return (
              <Card 
                key={run.test_run_id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onSelectTestRun(run.test_run_id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <Play className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Test Run #{run.test_run_id}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FileText className="w-4 h-4 mr-1" />
                            <span 
                              className="text-blue-600 hover:underline cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectTestSuite(run.test_suite);
                              }}
                            >
                              {testSuite?.name || `Suite ${run.test_suite}`}
                            </span>
                            <span className="mx-2">•</span>
                            <Clock className="w-4 h-4 mr-1" />
                            {formatRunTime(run.test_run_date)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Test Suite Type */}
                      <div className="text-center">
                        <Badge variant="outline" className={
                          testSuite?.type === 'excel' 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-purple-100 text-purple-700 border-purple-200'
                        }>
                          {testSuite?.type || 'Unknown'}
                        </Badge>
                      </div>

                      {/* Execution Time */}
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {run.total_time || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">Execution Time</div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center">
                        <Badge variant="outline" className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>

                      {/* Test Results Count */}
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {run.test_results?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Test Results</div>
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

export default Dashboard;
