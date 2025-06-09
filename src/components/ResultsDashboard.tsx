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
      return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    } else if (score >= threshold * 0.8) {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (score: number, threshold: number = 85) => {
    if (score >= threshold) {
      return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-800';
    } else if (score >= threshold * 0.8) {
      return 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-800';
    } else {
      return 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-900/20 dark:border-red-800';
    }
  };

  const getScoreTextColor = (score: number): { color: string; label: string } => {
  if (score >= 90) return { color: 'text-emerald-600 dark:text-emerald-400', label: 'Excellent' };
  if (score >= 80) return { color: 'text-green-500 dark:text-green-400', label: 'Good' };
  if (score >= 70) return { color: 'text-lime-500 dark:text-lime-400', label: 'Fair' };
  if (score >= 60) return { color: 'text-yellow-500 dark:text-yellow-400', label: 'Warning' };
  if (score >= 50) return { color: 'text-orange-500 dark:text-orange-400', label: 'Poor' };
  if (score >= 40) return { color: 'text-red-400 dark:text-red-300', label: 'Critical' };
  if (score >= 30) return { color: 'text-red-600 dark:text-red-500', label: 'Critical' };
  return { color: 'text-blue-600 dark:text-blue-400', label: 'Critical' };
};

  

  // Generate realistic count data based on score percentages
  const getCountFromPercentage = (percentage: number, total: number = 100) => {
    return Math.round((percentage / 100) * total);
  };

  const categoryTitles = {
    content_evaluation: 'Content Evaluation',
    retrieval_generation: 'Retrieval and Generation Evaluation',
    functional_testing: 'Functional Testing',
    non_functional_testing: 'Non-Functional Testing'
  };

  const totalQuestionsPairs = 100; // Total question-answer pairs in test suite

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overall Score Card */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 transform transition-transform hover:scale-105">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800 dark:text-gray-100">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Overall Evaluation Score
          </CardTitle>
          <div className={`text-4xl font-bold mt-2 ${getScoreTextColor(results.overall_score)}`}>
            {results.overall_score}%
          </div>
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-2">
            {getCountFromPercentage(results.overall_score, totalQuestionsPairs)}/{totalQuestionsPairs} correctly predicted
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Comprehensive performance evaluation of OrionAI
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Category Overview Cards */}
{/* Category Overview Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {Object.entries(results.category_scores).map(([key, score]: [string, any]) => {
    const { color, label } = getScoreTextColor(score);

    return (
      <Card
        key={key}
        className={`relative border transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${getStatusColor(score)}`}
      >
        {/* Top-right bubble */}
        <span
          className={`absolute top-14 right-2 px-2 py-0.5 text-xs rounded-full bg-white dark:bg-gray-800 shadow-sm ${color}`}
        >
          {label}
        </span>

        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{categoryTitles[key]}</h3>
            {getStatusIcon(score)}
          </div>
          <div className="space-y-2">
            <div className={`text-2xl font-bold ${color}`}>{score}%</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {getCountFromPercentage(score, 25)}/25 correct
            </div>
            <Progress value={score} variant="score" className="h-2" />
          </div>
        </CardContent>
      </Card>
    );
  })}
</div>



      {/* Detailed Results Tabs */}
      <Tabs defaultValue="content_evaluation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800">
          <TabsTrigger value="content_evaluation" className="transition-all duration-200 hover:scale-105 text-gray-700 dark:text-gray-300">Content Evaluation</TabsTrigger>
          <TabsTrigger value="retrieval_generation" className="transition-all duration-200 hover:scale-105 text-gray-700 dark:text-gray-300">Retrieval & Generation</TabsTrigger>
          <TabsTrigger value="functional_testing" className="transition-all duration-200 hover:scale-105 text-gray-700 dark:text-gray-300">Functional Testing</TabsTrigger>
          <TabsTrigger value="non_functional_testing" className="transition-all duration-200 hover:scale-105 text-gray-700 dark:text-gray-300">Non-Functional Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="content_evaluation">
  <Card className="transform transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800">
    <CardHeader>
      <CardTitle className="text-gray-800 dark:text-gray-100">Content Evaluation Metrics</CardTitle>
      <CardDescription className="text-gray-600 dark:text-gray-400">
        Correctness, Hallucination, Answer Relevancy, Contextual Relevancy
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {Object.entries(results.detailed_results.content_evaluation).map(([key, score]: [string, any]) => {
        const { color, label } = getScoreTextColor(score);

        return (
          <div
            key={key}
            className={`relative flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:scale-102 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600`}
          >
            {/* Top-right bubble */}
            <span
              className={`absolute top-14 right-2 px-2 py-0.5 text-xs rounded-full bg-white dark:bg-gray-800 shadow-sm ${color}`}
            >
              {label}
            </span>

            <div>
              <h4 className="font-medium capitalize text-gray-800 dark:text-gray-100">{key.replace('_', ' ')}</h4>
              <p className={`text-sm font-semibold ${color}`}>Score: {score}%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{getCountFromPercentage(score, 25)}/25 correct predictions</p>
            </div>
            <div className="w-32">
              <Progress value={score} variant="score" className="h-2" />
            </div>
          </div>
        );
      })}
    </CardContent>
  </Card>
</TabsContent>


        <TabsContent value="retrieval_generation">
          <Card className="transform transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-gray-100">Retrieval and Generation Evaluation</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Summarization (Fluency, Conciseness, Relevance), Content Retrieval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summarization */}
              <div className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Summarization</h4>
                <div className="space-y-2">
                  {Object.entries(results.detailed_results.retrieval_generation.summarization).map(([key, score]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between">
                      
                      <div>
                        <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{key}</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{getCountFromPercentage(score, 10)}/10 correct</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getScoreTextColor(score)}`}>{score}%</span>
                        <div className="w-20">
                          <Progress value={score} variant="score" className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Other retrieval metrics */}
              <div className="flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:scale-102 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100">Retrieving Same Content</h4>
                  <p className={`text-sm font-semibold ${getScoreTextColor(results.detailed_results.retrieval_generation.retrieving_same_content)}`}>
                    Score: {results.detailed_results.retrieval_generation.retrieving_same_content}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {getCountFromPercentage(results.detailed_results.retrieval_generation.retrieving_same_content, 15)}/15 correct
                  </p>
                </div>
                <div className="w-32">
                  <Progress value={results.detailed_results.retrieval_generation.retrieving_same_content} variant="score" className="h-2" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:scale-102 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100">Retrieving Similar Content</h4>
                  <p className={`text-sm font-semibold ${getScoreTextColor(results.detailed_results.retrieval_generation.retrieving_similar_content)}`}>
                    Score: {results.detailed_results.retrieval_generation.retrieving_similar_content}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {getCountFromPercentage(results.detailed_results.retrieval_generation.retrieving_similar_content, 15)}/15 correct
                  </p>
                </div>
                <div className="w-32">
                  <Progress value={results.detailed_results.retrieval_generation.retrieving_similar_content} variant="score" className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="functional_testing">
          <Card className="transform transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-gray-100">Functional Testing</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Leading Questions (Biasness, Consistency, Factuality), Edge Cases, Unnecessary Context</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Leading Questions */}
              <div className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Leading Questions</h4>
                <div className="space-y-2">
                  {Object.entries(results.detailed_results.functional_testing.leading_questions).map(([key, score]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{key}</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{getCountFromPercentage(score, 8)}/8 correct</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getScoreTextColor(score)}`}>{score}%</span>
                        <div className="w-20">
                          <Progress value={score} variant="score" className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edge Cases */}
              <div className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Edge Cases</h4>
                <div className="space-y-2">
                  {Object.entries(results.detailed_results.functional_testing.edge_cases).map(([key, score]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{key.replace('_', ' ')}</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{getCountFromPercentage(score, 5)}/5 correct</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getScoreTextColor(score)}`}>{score}%</span>
                        <div className="w-20">
                          <Progress value={score} variant="score" className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unnecessary Context */}
              <div className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">Unnecessary Context</h4>
                <div className="space-y-2">
                  {Object.entries(results.detailed_results.functional_testing.unnecessary_context).map(([key, score]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{key.replace('_', ' ')}</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{getCountFromPercentage(score, 7)}/7 correct</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getScoreTextColor(score)}`}>{score}%</span>
                        <div className="w-20">
                          <Progress value={score} variant="score" className="h-1" />
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
          <Card className="transform transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-gray-100">Non-Functional Testing</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Repetitive Loops, Spam/Flooding, Intentional Misdirection, Prompt Overloading, Susceptibility to Prompt Tuning Attacks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(results.detailed_results.non_functional_testing).map(([key, score]: [string, any]) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:scale-102 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <div>
                    <h4 className="font-medium capitalize text-gray-800 dark:text-gray-100">{key.replace('_', ' ')}</h4>
                    <p className={`text-sm font-semibold ${getScoreTextColor(score)}`}>Score: {score}%</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{getCountFromPercentage(score, 25)}/25 correct predictions</p>
                  </div>
                  <div className="w-32">
                    <Progress value={score} variant="score" className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="transform transition-transform hover:scale-105 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
          Back
        </Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transform transition-transform hover:scale-105">
          Generate Report <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
