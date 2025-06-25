import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, AlertCircle, CheckCircle, Clock, BarChart3, FileText, Loader2, Database, Settings, Edit2, Trash2 } from "lucide-react";
import EditTestSuite from "./EditTestSuite";
import DeleteTestSuite from "./DeleteTestSuite";
import DisplayTestSuites from './DisplayTestSuites';
import ServerErrorPage from './ServerErrorPage';

interface TestRun {
  test_run_id: number;
  test_suite: number;
  test_run_date: string;
  execution_status: string;
  total_time: string | null;
  evaluation: any;
  test_results: any[];
  test_suite_name?: string;
  test_suite_type?: string;
}

interface TestSuite {
  id: number;
  user_id: number;
  name: string;
  type: 'excel' | 'custom';
  created_at: string;
  confidentialityStatus: boolean;
}

interface DashboardProps {
  testSuites: TestSuite[];
  userData: { id: number; name: string; email: string } | null;
  onSelectTestRun: (runId: number) => void;
  onSelectTestSuite: (suiteId: number) => void;
  onUpdateTestSuite?: (testSuite: TestSuite) => void;
  onDeleteTestSuite?: (suiteId: number) => void;
}

const Dashboard = ({ testSuites, userData, onSelectTestRun, onSelectTestSuite, onUpdateTestSuite, onDeleteTestSuite }: DashboardProps) => {
  const [allTestRuns, setAllTestRuns] = useState<TestRun[]>([]);
  const [suiteTestRuns, setSuiteTestRuns] = useState<Record<number, TestRun[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingSuites, setLoadingSuites] = useState(true);
  const [loadingSuiteRuns, setLoadingSuiteRuns] = useState<Record<number, boolean>>({});
  const [loadingSuiteId, setLoadingSuiteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suitesError, setSuitesError] = useState<string | null>(null);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    fetchAllTestRuns();
  }, [userData, testSuites]);

  useEffect(() => {
    // Fetch test runs for all test suites when they're loaded
    testSuites.forEach(suite => {
      fetchTestRunsForSuite(suite.id);
    });
  }, [testSuites]);

  const fetchTestRunsForSuite = async (suiteId: number) => {
    setLoadingSuiteRuns(prev => ({ ...prev, [suiteId]: true }));
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/test-suite/${suiteId}/test-run/filter/`);
      console.log(suiteId);
      
      if (!response.ok) {
        console.warn(`Failed to fetch test runs for suite ${suiteId}:`, response.status);
        setSuiteTestRuns(prev => ({ ...prev, [suiteId]: [] }));
        return;
      }
      
      const data = await response.json();
      console.log(`Fetched ${data.length} test runs for suite ${suiteId}:`, data);
      
      // Sort by date (newest first)
      const sortedRuns = Array.isArray(data) ? data.sort((a: TestRun, b: TestRun) => 
        new Date(b.test_run_date).getTime() - new Date(a.test_run_date).getTime()
      ) : [];
      
      setSuiteTestRuns(prev => ({ ...prev, [suiteId]: sortedRuns }));
    } catch (error) {
      console.error(`Error fetching test runs for suite ${suiteId}:`, error);
      setSuiteTestRuns(prev => ({ ...prev, [suiteId]: [] }));
    } finally {
      setLoadingSuiteRuns(prev => ({ ...prev, [suiteId]: false }));
    }
  };

  const fetchAllTestRuns = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const allRuns: TestRun[] = [];
      
      // Fetch test runs for each test suite
      for (const suite of testSuites) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/test-suite/${suite.id}/test-run/filter/`);
          console.log(suite.id);
          
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
        return { status: 'completed', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200', label: 'Completed' };
      case 'running':
        return { status: 'running', icon: Clock, color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Running' };
      case 'failed':
        return { status: 'failed', icon: AlertCircle, color: 'bg-red-100 text-red-700 border-red-200', label: 'Failed' };
      default:
        return { status: 'unknown', icon: AlertCircle, color: 'bg-gray-100 text-gray-700 border-gray-200', label: status };
    }
  };

  const getTestSuiteStatus = (suiteId: number) => {
    const testRuns = suiteTestRuns[suiteId] || [];
    
    if (testRuns.length === 0) {
      return { status: 'not-run', icon: AlertCircle, color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Not Run' };
    }
    
    // Get the latest test run
    const latestRun = testRuns[0]; // Already sorted by date, newest first
    
    // Check if the latest run has evaluation data
    if (latestRun.evaluation && latestRun.evaluation.overall_score !== undefined) {
      const overallScore = latestRun.evaluation.overall_score;
      if (overallScore >= 95) {
        return { status: 'excellent', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200', label: 'Excellent' };
      } else if (overallScore >= 85) {
        return { status: 'good', icon: CheckCircle, color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Good' };
      } else if (overallScore >= 70) {
        return { status: 'warning', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Needs Improvement' };
      } else {
        return { status: 'poor', icon: AlertCircle, color: 'bg-red-100 text-red-700 border-red-200', label: 'Poor' };
      }
    }
    
    // If no evaluation data but has test runs, show as completed
    if (latestRun.execution_status === 'Completed') {
      return { status: 'completed', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200', label: 'Completed' };
    }
    
    return { status: 'running', icon: Clock, color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Running' };
  };

  const formatRunTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatSuiteTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatLastRun = (suiteId: number) => {
    const testRuns = suiteTestRuns[suiteId] || [];
    if (testRuns.length === 0) return 'Never';
    
    const latestRun = testRuns[0];
    const date = new Date(latestRun.test_run_date);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTestSuiteById = (suiteId: number) => {
    return testSuites.find(suite => suite.id === suiteId);
  };

  // Function to check if results are null (same as in TestExecution)
  const checkResultsNull = (results: any) => {
    return !results || results.evaluation === null || (Array.isArray(results.test_results) && results.test_results.length === 0);
  };

  // Function to fetch actual results (same as in TestExecution)
  const fetchActualResults = async (runId: number, suiteId: number) => {
    console.log("Test Suite ID:", suiteId);
    console.log("Test Run ID:", runId);
    if (!suiteId || !runId) throw new Error("Missing required IDs");
  
    console.log("Fetching results with:");
    console.log("✅ Test Run ID returned:", runId);
  
    const response = await fetch(`http://127.0.0.1:8000/test-suite/${suiteId}/test-run/${runId}/`);
    if (!response.ok) {
      throw new Error("Failed to fetch test results");
    }
  
    const data = await response.json();
    console.log("✅ Results fetched:\n" + JSON.stringify(data, null, 2));
    return data;
  };

  // Updated test run click handler
  const handleTestRunClick = async (runId: number) => {
    try {
      // Find the test suite for this run
      const run = allTestRuns.find(r => r.test_run_id === runId);
      if (!run) {
        console.error("Test run not found");
        return;
      }

      // Fetch actual results
      const results = await fetchActualResults(runId, run.test_suite);
      
      // Check if results are null
      if (checkResultsNull(results)) {
        setServerError(true);
        return;
      }
      
      // If results are valid, proceed normally
      onSelectTestRun(runId);
    } catch (error) {
      console.error("Failed to fetch test run results:", error);
      setServerError(true);
    }
  };

  // Updated test suite click handler
  const handleTestSuiteClick = async (suiteId: number) => {
    console.log("handleTestSuiteClick called with suiteId:", suiteId);
    setLoadingSuiteId(suiteId);
    
    try {
      // Fetch test runs from API
      const response = await fetch(`http://127.0.0.1:8000/test-suite/${suiteId}/test-run/filter/`);
      console.log(suiteId);
      
      if (!response.ok) {
        console.error(`Failed to fetch test runs for suite ${suiteId}:`, response.status);
        // Still proceed to view the test suite even if API fails
        onSelectTestSuite(suiteId);
        return;
      }
      
      const testRuns = await response.json();
      console.log(`Fetched ${testRuns.length} test runs for suite ${suiteId}:`, testRuns);
      
      // Proceed to view the test suite
      onSelectTestSuite(suiteId);
    } catch (error) {
      console.error(`Error fetching test runs for suite ${suiteId}:`, error);
      // Still proceed to view the test suite even if API fails
      onSelectTestSuite(suiteId);
    } finally {
      setLoadingSuiteId(null);
    }
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

  // Show server error page if needed
  if (serverError) {
    return (
        <ServerErrorPage 
          errorCode={500} 
          title="Server Error" 
          description="Failed to load test results. Please check your server connection and try again." 
          showRefresh={true}
          onGoHome={() => {
            setServerError(false);
            // You might want to navigate to dashboard or home here
          }}
        />
    );
  }

  const suitesToUse = testSuites;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Test Runs Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test Runs</h1>
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
                  onClick={() => handleTestRunClick(run.test_run_id)}
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
                              <Clock className="w-4 h-4 mr-1" />
                              {formatRunTime(run.test_run_date)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
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

                        {/* Test Suite Information - Far Right */}
                        <div className="text-right border-l pl-6 ml-6">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Test Suite
                          </div>
                          <div className="text-sm font-semibold text-blue-600">
                            {testSuite?.name || run.test_suite_name || `Suite ${run.test_suite}`}
                          </div>
                          <Badge variant="outline" className={
                            (testSuite?.type || run.test_suite_type) === 'excel' 
                              ? 'bg-green-100 text-green-700 border-green-200 text-xs mt-1' 
                              : 'bg-purple-100 text-purple-700 border-purple-200 text-xs mt-1'
                          }>
                            {testSuite?.type || run.test_suite_type || 'Unknown'}
                          </Badge>
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

      {/* Test Suites Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600 mt-2">Total Test Suites</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{suitesToUse.length}</div>
            <div className="text-sm text-gray-500">Total Test Suites</div>
          </div>
        </div>
        <DisplayTestSuites
          testSuites={suitesToUse}
          testSuiteResults={{}}
          onSelectTestSuite={onSelectTestSuite}
          onUpdateTestSuite={onUpdateTestSuite}
          onDeleteTestSuite={onDeleteTestSuite}
          onBack={() => {}}
        />
      </div>
    </div>
  );
};

export default Dashboard;
