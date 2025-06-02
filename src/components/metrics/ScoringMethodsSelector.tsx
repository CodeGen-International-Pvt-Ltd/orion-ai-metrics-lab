
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ScoringMethodsSelectorProps {
  config: any;
  setConfig: (config: any) => void;
}

const ScoringMethodsSelector = ({ config, setConfig }: ScoringMethodsSelectorProps) => {
  const statisticalMethods = [
    'BLEU', 'ROUGE', 'METEOR', 'Levenshtein distance', 'R-Precision'
  ];

  const modelBasedMethods = [
    'BERT', 'BART', 'DistilBERT', 'RoBERTa', 'BLEURT', 'G-Eval', 'BERTScore', 'SPICE', 'WMD', 'ELMO'
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Statistical Methods</h3>
        <div className="space-y-3">
          {statisticalMethods.map((method) => (
            <div key={method} className="flex items-center space-x-2 p-3 border rounded-lg">
              <Checkbox
                checked={config.statisticalMethods?.[method] || false}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  statisticalMethods: { ...config.statisticalMethods, [method]: checked }
                })}
              />
              <Label className="text-sm">{method}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Model-Based Methods</h3>
        <div className="space-y-3">
          {modelBasedMethods.map((method) => (
            <div key={method} className="flex items-center space-x-2 p-3 border rounded-lg">
              <Checkbox
                checked={config.modelBasedMethods?.[method] || false}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  modelBasedMethods: { ...config.modelBasedMethods, [method]: checked }
                })}
              />
              <Label className="text-sm">{method}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoringMethodsSelector;
