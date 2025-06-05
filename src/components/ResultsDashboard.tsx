import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

interface ResultsDashboardProps {
  results: any;
  onNext: () => void;
  onBack: () => void;
}

const ResultsDashboard = ({ results, onNext, onBack }: ResultsDashboardProps) => {
  if (!results) return null;

  const getStatusIcon = (score: number, threshold: number = 85) => {
    if (score >= threshold) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (score >= threshold * 0.8) {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (score: number, threshold: number = 85) => {
    if (score >= threshold) {
      return 'text-green-700 bg-green-50 border-green-200';
    } else if (score >= threshold * 0.8) {
      return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    } else {
      return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  const categoryTitles = {
    content_evaluation: 'Content Evaluation',
    retrieval_generation: 'Retrieval and Generation Evaluation',
    functional_testing: 'Functional Testing',
    non_functional_testing: 'Non-Functional Testing'
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

      {/* Category Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(results.category_scores).map(([key, score]: [string, any]) => (
          <Card key={key} className={`border ${getStatusColor(score)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">
                  {categoryTitles[key]}
                </h3>
                {getStatusIcon(score)}
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{score}%</div>
                <Progress value={score} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Results Tabs */}
      <Tabs defaultValue="content_evaluation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content_evaluation">Content Evaluation</TabsTrigger>
          <TabsTrigger value="retrieval_generation">Retrieval & Generation</TabsTrigger>
          <TabsTrigger value="functional_testing">Functional Testing</TabsTrigger>
          <TabsTrigger value="non_functional_testing">Non-Functional Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="content_evaluation">
          <Card>
            <CardHeader>
              <CardTitle>Content Evaluation Metrics</CardTitle>
              <CardDescription>Core content quality and accuracy metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(results.detailed_results.content_evaluation).map(([key, score]: [string, any]) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium capitalize">{key.replace('_', ' ')}</h4>
                    <p className="text-sm text-gray-600">Score: {score}%</p>
                  </div>
                  <div className="w-32">
                    <Progress value={score} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retrieval_generation">
          <Card>
            <CardHeader>
              <CardTitle>Retrieval and Generation Evaluation</CardTitle>
              <CardDescription>Information retrieval and content generation metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summarization */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Summarization</h4>
                <div className="space-y-2">
                  {Object.entries(results.detailed_results.retrieval_generation.summarization).map(([key, score]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{score}%</span>
                        <div className="w-20">
                          <Progress value={score} className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Other retrieval metrics */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Retrieving Same Content</h4>
                  <p className="text-sm text-gray-600">Score: {results.detailed_results.retrieval_generation.retrieving_same_content}%</p>
                </div>
                <div className="w-32">
                  <Progress value={results.detailed_results.retrieval_generation.retrieving_same_content} className="h-2" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Retrieving Similar Content</h4>
                  <p className="text-sm text-gray-600">Score: {results.detailed_results.retrieval_generation.retrieving_similar_content}%</p>
                </div>
                <div className="w-32">
                  <Progress value={results.detailed_results.retrieval_generation.retrieving_similar_content} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="functional_testing">
          <Card>
            <CardHeader>
              <CardTitle>Functional Testing</CardTitle>
              <CardDescription>Functional behavior and edge case handling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Leading Questions */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Leading Questions</h4>
                <div className="space-y-2">
                  {Object.entries(results.detailed_results.functional_testing.leading_questions).map(([key, score]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{score}%</span>
                        <div className="w-20">
                          <Progress value={score} className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edge Cases */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Edge Cases</h4>
                <div className="space-y-2">
                  {Object.entries(results.detailed_results.functional_testing.edge_cases).map(([key, score]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{score}%</span>
                        <div className="w-20">
                          <Progress value={score} className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unnecessary Context */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Unnecessary Context</h4>
                <div className="space-y-2">
                  {Object.entries(results.detailed_results.functional_testing.unnecessary_context).map(([key, score]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{score}%</span>
                        <div className="w-20">
                          <Progress value={score} className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="non_functional_testing">
          <Card>
            <CardHeader>
              <CardTitle>Non-Functional Testing</CardTitle>
              <CardDescription>Security and robustness evaluation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(results.detailed_results.non_functional_testing).map(([key, score]: [string, any]) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium capitalize">{key.replace('_', ' ')}</h4>
                    <p className="text-sm text-gray-600">Score: {score}%</p>
                  </div>
                  <div className="w-32">
                    <Progress value={score} className="h-2" />
                  </div>
                </div>
              ))}
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
