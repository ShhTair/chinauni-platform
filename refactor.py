import re
import os

path = "/home/tair/Claude Sandbox/uni_guide/chinauni/frontend/src/pages/IntakeFormPage.tsx"
with open(path, "r") as f:
    text = f.read()

# Remove STEPS and Step
text = re.sub(r"const STEPS = \['Университет'.*?\n", "", text)
text = re.sub(r"type Step = .*?\n", "", text)

# Remove step state
text = re.sub(r"\s*const \[step, setStep\] = useState<Step>\(0\)\n", "\n", text)

# Remove stepper UI
text = re.sub(r"\s*\{\/\* Stepper \*\/\}.*?\{\/\* Step content \*\/\}\n", "\n      {/* Step content */}\n", text, flags=re.DOTALL)

# Replace step content
new_content = """        <div className="space-y-12">
          <div className="space-y-5">
            <Step1 uni={uni} form={form} set={set} />
          </div>
          <hr className="border-border" />
          <div className="space-y-5">
            <Step2 form={form} toggleExam={toggleExam} updateExam={updateExam} />
          </div>
          <hr className="border-border" />
          <div className="space-y-5">
            <Step3 form={form} set={set} />
          </div>
          <hr className="border-border" />
          <div className="space-y-5">
            <Step4 form={form} set={set} error={error} />
          </div>
        </div>"""

text = re.sub(r"\s*<AnimatePresence mode=\"wait\">.*?</AnimatePresence>\n", "\n" + new_content + "\n", text, flags=re.DOTALL)

# Replace Navigation
new_nav = """      {/* Navigation */}
      <div className="mt-10">
        <Button className="w-full" size="lg" loading={submitting} onClick={handleSubmit}>
            Отправить анкету
        </Button>
      </div>"""

text = re.sub(r"\s*\{\/\* Navigation \*\/\}.*?</div>\n", "\n" + new_nav + "\n", text, flags=re.DOTALL)

with open(path, "w") as f:
    f.write(text)

print("Done")