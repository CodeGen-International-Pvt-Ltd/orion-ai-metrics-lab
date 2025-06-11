import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

interface ResultsDashboardProps {
  results: any;
  onNext: () => void;
  onBack: () => void;
}

const ResultsDashboard = ({ results, onNext, onBack }: ResultsDashboardProps) => {
  if (!results) return null;

  const getStatusIcon = (score: number, threshold: number = 85) => {
    if (score >= threshold) {
      return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
    return null; // Remove exclamation mark icons
  };

  const getStatusColor = (score: number, threshold: number = 85) => {
    if (score >= threshold) {
      return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-700/50';
    } else if (score >= threshold * 0.8) {
      return 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700/50';
    } else {
      return 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-900/30 dark:border-red-700/50';
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
    return { color: 'text-red-600 dark:text-red-500', label: 'Critical' };
  };

  // Generate realistic count data based on score percentages
  const getCountFromPercentage = (percentage: number, total: number = 100) => {
    return Math.round((percentage / 100) * total);
  };

  // Calculate total pass count for grouped metrics by summing individual pass counts
  const getTotalPassCountForGroup = (groupData: any, baseTotal: number = 25) => {
    if (typeof groupData === 'object' && groupData !== null) {
      let total = 0;
      for (const key in groupData) {
        const value = groupData[key];
        if (typeof value === 'number') {
          total += getCountFromPercentage(value, baseTotal);
        }
      }
      return total;
    }
    return 0;
  };

  // Calculate average pass count for categories with different structures
  const getAveragePassCount = (categoryData: any, categoryKey: string) => {
    let totalCount = 0;
    let itemCount = 0;

    if (categoryKey === 'content_evaluation' || categoryKey === 'non_functional_testing') {
      // Simple metrics without sub-scores
      for (const key in categoryData) {
        const value = categoryData[key];
        if (typeof value === 'number') {
          totalCount += getCountFromPercentage(value, 25);
          itemCount++;
        }
      }
    } else if (categoryKey === 'retrieval_generation') {
      // Has summarization (with sub-scores) and retrieving_content
      if (categoryData.summarization && typeof categoryData.summarization === 'object') {
        totalCount += getTotalPassCountForGroup(categoryData.summarization, 10);
        itemCount++;
      }
      if (typeof categoryData.retrieving_same_content === 'number') {
        totalCount += getCountFromPercentage(categoryData.retrieving_same_content, 15);
        itemCount++;
      }
      if (typeof categoryData.retrieving_similar_content === 'number') {
        totalCount += getCountFromPercentage(categoryData.retrieving_similar_content, 15);
        itemCount++;
      }
    } else if (categoryKey === 'functional_testing') {
      // Has leading_questions (with sub-scores), edge_cases, and unnecessary_context
      if (categoryData.leading_questions && typeof categoryData.leading_questions === 'object') {
        totalCount += getTotalPassCountForGroup(categoryData.leading_questions, 8);
        itemCount++;
      }
      if (categoryData.edge_cases && typeof categoryData.edge_cases === 'object') {
        totalCount += getTotalPassCountForGroup(categoryData.edge_cases, 5);
        itemCount++;
      }
      if (categoryData.unnecessary_context && typeof categoryData.unnecessary_context === 'object') {
        totalCount += getTotalPassCountForGroup(categoryData.unnecessary_context, 7);
        itemCount++;
      }
    }

    return itemCount > 0 ? Math.round(totalCount / itemCount) : 0;
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
      <Card className="border-2 border-primary/20 dark:border-primary/30 bg-gradient-to-r from-background/95 to-accent/30 dark:from-background/80 dark:to-accent/20 backdrop-blur-lg transform transition-transform">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-foreground">
            <BarChart3 className="w-8 h-8 text-primary" />
            Overall Evaluation Pass Count Percentage
          </CardTitle>
          <div className={`text-4xl font-bold mt-2 ${getScoreTextColor(results.overall_score).color}`}>
            {results.overall_score}%
          </div>
          <div className="text-lg font-medium text-muted-foreground mt-2">
            {getCountFromPercentage(results.overall_score, totalQuestionsPairs)}/{totalQuestionsPairs} correctly predicted
          </div>
          <CardDescription className="text-muted-foreground">
            Comprehensive performance evaluation of OrionAI
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Category Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(results.category_scores).map(([key, score]: [string, any]) => {
          const { color, label } = getScoreTextColor(score);
          const averagePassCount = getAveragePassCount(results.detailed_results[key], key);

          return (
            <Card
              key={key}
              className={`relative border transform transition-all duration-300 hover:scale-105 hover:shadow-lg bg-card/90 dark:bg-card/70 backdrop-blur-sm ${getStatusColor(score)}`}
            >
              {/* Top-right bubble - moved away from icon area */}
              <span
                className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full bg-background/90 dark:bg-background/80 shadow-sm backdrop-blur-sm ${color} z-10`}
              >
                {label}
              </span>

              <CardContent className="p-4 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm text-foreground pr-16">{categoryTitles[key]}</h3>
                  {getStatusIcon(score)}
                </div>
                <div className="space-y-2">
                  <div className={`text-2xl font-bold ${color}`}>{score}%</div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Average Pass Count: {averagePassCount}
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
        <TabsList className="grid w-full grid-cols-4 bg-background/90 dark:bg-background/70 backdrop-blur-sm border border-border/50">
          <TabsTrigger value="content_evaluation" className="transition-all duration-200 hover:scale-105 text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Content Evaluation</TabsTrigger>
          <TabsTrigger value="retrieval_generation" className="transition-all duration-200 hover:scale-105 text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Retrieval & Generation</TabsTrigger>
          <TabsTrigger value="functional_testing" className="transition-all duration-200 hover:scale-105 text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Functional Testing</TabsTrigger>
          <TabsTrigger value="non_functional_testing" className="transition-all duration-200 hover:scale-105 text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Non-Functional Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="content_evaluation">
          <Card className="transform transition-all duration-300 hover:shadow-lg bg-card/90 dark:bg-card/70 backdrop-blur-lg border-border/60">
            <CardHeader>
              <CardTitle className="text-foreground">Content Evaluation Metrics</CardTitle>
              <CardDescription className="text-muted-foreground">
                Correctness, Hallucination, Answer Relevancy, Contextual Relevancy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(results.detailed_results.content_evaluation).map(([key, score]: [string, any]) => {
                const { color, label } = getScoreTextColor(score);

                return (
                  <div
                    key={key}
                    className={`relative flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:scale-102 bg-background/50 dark:bg-background/30 backdrop-blur-sm border-border/60`}
                  >
                    {/* Grade label positioned above progress bar */}
                    <div className="flex-1">
                      <h4 className="font-medium capitalize text-foreground">{key.replace('_', ' ')}</h4>
                      <p className={`text-sm font-semibold ${color}`}>Score: {score}%</p>
                      <p className="text-xs text-muted-foreground">Pass Count: {getCountFromPercentage(score, 25)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 w-32">
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-background/90 dark:bg-background/80 shadow-sm ${color}`}>
                        {label}
                      </span>
                      <Progress value={score} variant="score" className="h-2 w-full" />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retrieval_generation">
          <Card className="transform transition-all duration-300 hover:shadow-lg bg-card/90 dark:bg-card/70 backdrop-blur-lg border-border/60">
            <CardHeader>
              <CardTitle className="text-foreground">Retrieval and Generation Evaluation</CardTitle>
              <CardDescription className="text-muted-foreground">Summarization (Fluency, Conciseness, Relevance), Content Retrieval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summarization */}
              <div className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md bg-background/50 dark:bg-background/30 backdrop-blur-sm border-border/60">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">Summarization</h4>
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Pass Count: {getTotalPassCountForGroup(results.detailed_results.retrieval_generation.summarization, 10)}
                  </div>
                </div>
                <div className="space-y-3">
                  {Object.entries(results.detailed_results.retrieval_generation.summarization).map(([key, score]: [string, any]) => {
                    const { color, label } = getScoreTextColor(score);
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-sm capitalize text-foreground">{key}</span>
                          <p className="text-xs text-muted-foreground">Pass Count: {getCountFromPercentage(score, 10)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 w-24">
                          <span className={`text-xs px-2 py-0.5 rounded-full bg-background/90 dark:bg-background/80 shadow-sm ${color}`}>
                            {label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${color}`}>{score}%</span>
                            <div className="w-16">
                              <Progress value={score} variant="score" className="h-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Other retrieval metrics */}
              <div className="relative flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:scale-102 bg-background/50 dark:bg-background/30 backdrop-blur-sm border-border/60">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Retrieving Same Content</h4>
                  <p className={`text-sm font-semibold ${getScoreTextColor(results.detailed_results.retrieval_generation.retrieving_same_content).color}`}>
                    Pass Count Percentage: {results.detailed_results.retrieval_generation.retrieving_same_content}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pass Count: {getCountFromPercentage(results.detailed_results.retrieval_generation.retrieving_same_content, 15)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 w-32">
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-background/90 dark:bg-background/80 shadow-sm ${getScoreTextColor(results.detailed_results.retrieval_generation.retrieving_same_content).color}`}>
                    {getScoreTextColor(results.detailed_results.retrieval_generation.retrieving_same_content).label}
                  </span>
                  <Progress value={results.detailed_results.retrieval_generation.retrieving_same_content} variant="score" className="h-2 w-full" />
                </div>
              </div>
              
              <div className="relative flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:scale-102 bg-background/50 dark:bg-background/30 backdrop-blur-sm border-border/60">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Retrieving Similar Content</h4>
                  <p className={`text-sm font-semibold ${getScoreTextColor(results.detailed_results.retrieval_generation.retrieving_similar_content).color}`}>
                    Pass Count Percentage: {results.detailed_results.retrieval_generation.retrieving_similar_content}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pass Count: {getCountFromPercentage(results.detailed_results.retrieval_generation.retrieving_similar_content, 15)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 w-32">
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-background/90 dark:bg-background/80 shadow-sm ${getScoreTextColor(results.detailed_results.retrieval_generation.retrieving_similar_content).color}`}>
                    {getScoreTextColor(results.detailed_results.retrieval_generation.retrieving_similar_content).label}
                  </span>
                  <Progress value={results.detailed_results.retrieval_generation.retrieving_similar_content} variant="score" className="h-2 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="functional_testing">
          <Card className="transform transition-all duration-300 hover:shadow-lg bg-card/90 dark:bg-card/70 backdrop-blur-lg border-border/60">
            <CardHeader>
              <CardTitle className="text-foreground">Functional Testing</CardTitle>
              <CardDescription className="text-muted-foreground">Leading Questions (Biasness, Consistency, Factuality), Edge Cases, Unnecessary Context</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Leading Questions */}
              <div className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md bg-background/50 dark:bg-background/30 backdrop-blur-sm border-border/60">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">Leading Questions</h4>
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Pass Count: {getTotalPassCountForGroup(results.detailed_results.functional_testing.leading_questions, 8)}
                  </div>
                </div>
                <div className="space-y-3">
                  {Object.entries(results.detailed_results.functional_testing.leading_questions).map(([key, score]: [string, any]) => {
                    const { color, label } = getScoreTextColor(score);
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-sm capitalize text-foreground">{key}</span>
                          <p className="text-xs text-muted-foreground">Pass Count: {getCountFromPercentage(score, 8)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 w-24">
                          <span className={`text-xs px-2 py-0.5 rounded-full bg-background/90 dark:bg-background/80 shadow-sm ${color}`}>
                            {label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${color}`}>{score}%</span>
                            <div className="w-16">
                              <Progress value={score} variant="score" className="h-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Edge Cases */}
              <div className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md bg-background/50 dark:bg-background/30 backdrop-blur-sm border-border/60">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">Edge Cases</h4>
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Pass Count: {getTotalPassCountForGroup(results.detailed_results.functional_testing.edge_cases, 5)}
                  </div>
                </div>
                <div className="space-y-3">
                  {Object.entries(results.detailed_results.functional_testing.edge_cases).map(([key, score]: [string, any]) => {
                    const { color, label } = getScoreTextColor(score);
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-sm capitalize text-foreground">{key.replace('_', ' ')}</span>
                          <p className="text-xs text-muted-foreground">Pass Count: {getCountFromPercentage(score, 5)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 w-24">
                          <span className={`text-xs px-2 py-0.5 rounded-full bg-background/90 dark:bg-background/80 shadow-sm ${color}`}>
                            {label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${color}`}>{score}%</span>
                            <div className="w-16">
                              <Progress value={score} variant="score" className="h-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Unnecessary Context */}
              <div className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md bg-background/50 dark:bg-background/30 backdrop-blur-sm border-border/60">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">Unnecessary Context</h4>
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Pass Count: {getTotalPassCountForGroup(results.detailed_results.functional_testing.unnecessary_context, 7)}
                  </div>
                </div>
                <div className="space-y-3">
                  {Object.entries(results.detailed_results.functional_testing.unnecessary_context).map(([key, score]: [string, any]) => {
                    const { color, label } = getScoreTextColor(score);
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-sm capitalize text-foreground">{key.replace('_', ' ')}</span>
                          <p className="text-xs text-muted-foreground">Pass Count: {getCountFromPercentage(score, 7)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 w-24">
                          <span className={`text-xs px-2 py-0.5 rounded-full bg-background/90 dark:bg-background/80 shadow-sm ${color}`}>
                            {label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${color}`}>{score}%</span>
                            <div className="w-16">
                              <Progress value={score} variant="score" className="h-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="non_functional_testing">
          <Card className="transform transition-all duration-300 hover:shadow-lg bg-card/90 dark:bg-card/70 backdrop-blur-lg border-border/60">
            <CardHeader>
              <CardTitle className="text-foreground">Non-Functional Testing</CardTitle>
              <CardDescription className="text-muted-foreground">Repetitive Loops, Spam/Flooding, Intentional Misdirection, Prompt Overloading, Susceptibility to Prompt Tuning Attacks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(results.detailed_results.non_functional_testing).map(([key, score]: [string, any]) => {
                const { color, label } = getScoreTextColor(score);
                return (
                  <div key={key} className="relative flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:scale-102 bg-background/50 dark:bg-background/30 backdrop-blur-sm border-border/60">
                    <div className="flex-1">
                      <h4 className="font-medium capitalize text-foreground">{key.replace('_', ' ')}</h4>
                      <p className={`text-sm font-semibold ${color}`}>Pass Count Percentage: {score}%</p>
                      <p className="text-xs text-muted-foreground">Pass Count: {getCountFromPercentage(score, 25)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 w-32">
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-background/90 dark:bg-background/80 shadow-sm ${color}`}>
                        {label}
                      </span>
                      <Progress value={score} variant="score" className="h-2 w-full" />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="transform transition-transform hover:scale-105 border-border hover:bg-accent">
          Back
        </Button>
        <Button onClick={onNext} className="bg-primary hover:bg-primary/90 text-primary-foreground transform transition-transform hover:scale-105">
          Generate Report <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
