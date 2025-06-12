import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowLeft, AlertCircle, CheckCircle, Clock } from "lucide-react";
import EditTestSuite from "./EditTestSuite";
import DeleteTestSuite from "./DeleteTestSuite";

interface TestSuite {
  id: number;
  user_id: number;
  name: string;
  type: 'excel' | 'custom';
  created_at: string;
  confidentialityStatus: boolean;
}

interface DisplayTestSuitesProps {
  testSuites: TestSuite[];
  testSuiteResults: Record<string, any>;
  onSelectTestSuite: (suiteId: number) => void;
  onUpdateTestSuite: (testSuite: TestSuite) => void;
  onDeleteTestSuite: (suiteId: number) => void;
  onBack: () => void;
}

const DisplayTestSuites = ({ testSuites, testSuiteResults, onSelectTestSuite, onUpdateTestSuite, onDeleteTestSuite, onBack }: DisplayTestSuitesProps) => {
  const getTestSuiteStatus = (suiteId: number) => {
    const results = testSuiteResults[suiteId];
    if (!results || !results.testRuns || results.testRuns.length === 0) {
      return { status: 'not-run', icon: AlertCircle, color: 'bg-gray-100 text-gray-700', label: 'Not Run' };
    }
    
    const latestRun = results.testRuns[results.testRuns.length - 1];
    const overallScore = latestRun.overall_score;
    if (overallScore >= 95) {
      return { status: 'excellent', icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Excellent' };
    } else if (overallScore >= 85) {
      return { status: 'good', icon: CheckCircle, color: 'bg-blue-100 text-blue-700', label: 'Good' };
    } else if (overallScore >= 70) {
      return { status: 'warning', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700', label: 'Needs Improvement' };
    } else {
      return { status: 'poor', icon: AlertCircle, color: 'bg-red-100 text-red-700', label: 'Poor' };
    }
  };

  const formatLastRun = (suiteId: number) => {
    const results = testSuiteResults[suiteId];
    if (!results || !results.testRuns || results.testRuns.length === 0) return 'Never';
    
    const latestRun = results.testRuns[results.testRuns.length - 1];
    const date = new Date(latestRun.timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getLatestResults = (suiteId: number) => {
    const results = testSuiteResults[suiteId];
    if (!results || !results.testRuns || results.testRuns.length === 0) return null;
    return results.testRuns[results.testRuns.length - 1];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Test Suites</h1>
          <p className="text-gray-600 mt-2">Manage and view your test suites and their latest results</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {testSuites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Test Suites Created</h3>
            <p className="text-gray-600 mb-6">Create your first test suite to get started with AI evaluation</p>
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
              Create Test Suite
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testSuites.map((suite) => {
            const status = getTestSuiteStatus(suite.id);
            const latestResults = getLatestResults(suite.id);
            const StatusIcon = status.icon;
            
            return (
              <Card key={suite.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="flex gap-2">
                      <Badge variant="outline" className={
                        suite.type === 'excel' 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-purple-100 text-purple-700 border-purple-200'
                      }>
                        {suite.type}
                      </Badge>
                      <Badge variant="outline" className={status.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{suite.name}</CardTitle>
                      <CardDescription>
                        Input Format: {suite.type}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <EditTestSuite testSuite={suite} onUpdateTestSuite={onUpdateTestSuite} userId={suite.user_id} />
                      <DeleteTestSuite
  testSuite={suite}
  onDeleteTestSuite={onDeleteTestSuite}
  userId={suite.user_id}
/>

                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                <div
  className="space-y-4"
  onClick={() => {
    console.log("Test Suite clicked:", suite.id, "User ID:", suite.user_id);
    setTimeout(() => {
      onSelectTestSuite(suite.id);
    }, 1500); // Wait 0.5 sec to view console log
  }}
>


                    {/* Test Results Summary */}
                    {latestResults ? (
                      <div className="space-y-2 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Latest Score</span>
                          <span className="text-lg font-bold text-blue-600">{latestResults.overall_score}%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total Runs:</span>
                            <span className="text-blue-600 font-medium">{testSuiteResults[suite.id]?.testRuns?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Passed:</span>
                            <span className="text-green-600 font-medium">{latestResults.detailed_results?.passed || 0}</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            Last run: {formatLastRun(suite.id)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 cursor-pointer">
                        <AlertCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">No test runs yet</p>
                        <p className="text-xs text-gray-400">Click to view test suite</p>
                      </div>
                    )}
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

export default DisplayTestSuites;
