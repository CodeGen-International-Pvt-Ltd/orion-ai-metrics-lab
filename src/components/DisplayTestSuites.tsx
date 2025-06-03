
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft, Play } from "lucide-react";

interface TestSuite {
  id: string;
  name: string;
  type: 'Excel' | 'Custom';
}

interface DisplayTestSuitesProps {
  testSuites: TestSuite[];
  onSelectTestSuite: (suiteId: string) => void;
  onBack: () => void;
}

const DisplayTestSuites = ({ testSuites, onSelectTestSuite, onBack }: DisplayTestSuitesProps) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Suites</h1>
          <p className="text-gray-600 mt-2">Manage and view your test suites</p>
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
          {testSuites.map((suite) => (
            <Card key={suite.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    suite.type === 'Excel' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {suite.type}
                  </span>
                </div>
                <CardTitle className="text-lg">{suite.name}</CardTitle>
                <CardDescription>
                  Input Format: {suite.type}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Ready for execution
                  </div>
                  <Button 
                    onClick={() => onSelectTestSuite(suite.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    View Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayTestSuites;
