import { CelebrityStyleInsightProps } from "@/app/celebrity-style/celebrity-style";



export const parseCelebrityStyleData = (messageContent: string): CelebrityStyleInsightProps => {
  const lines = messageContent.trim().split("\n");

  const data: CelebrityStyleInsightProps = {
    introduction: "",
    keyElements: [],
    signatureLooks: [],
    preferredBrands: [],
    conclusion: "",
  };

  let currentSection: keyof CelebrityStyleInsightProps | null = "introduction";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for section headings (adjusted to handle bold or non-bold text)
    if (line.match(/Key Elements/)) {
      currentSection = "keyElements";
    } else if (line.match(/Signature Looks/)) {
      currentSection = "signatureLooks";
    } else if (line.match(/Preferred Brands/)) {
      currentSection = "preferredBrands";
    } else if (line.match(/Conclusion/)) {
      currentSection = "conclusion";
      // Keep accumulating conclusion lines until the end of the text
      while (i + 1 < lines.length) { 
        data.conclusion += lines[i + 1] + "\n";
        i++;
      }
      break; // Exit loop after conclusion is accumulated
    }

    // Process lines within sections (excluding introduction and conclusion)
    if (currentSection && currentSection !== "introduction" && currentSection !== "conclusion") {
      // Extract name and description (handle both bold and non-bold)
      const match = line.match(/-\s*(?:\*\*)?(.*?)(?:\*\*)?:\s*(.*)/);
      if (match) {
        const name = match[1];
        const description = match[2];

        // Handle specific sections
        switch (currentSection) {
          case "keyElements":
          case "signatureLooks":
            data[currentSection].push({ name, description });
            break;
          case "preferredBrands":
            data[currentSection].push({ name, description }); // No logoUrl
            break;
        }
      } 
    } else if (currentSection === "introduction") {
        // Accumulate introduction (including multiple lines) until next section
        data.introduction += line + "\n"; 
    } 
  }

  // Trim any extra whitespace from introduction and conclusion
  data.introduction = data.introduction.trim();
  data.conclusion = data.conclusion.trim();

  return data;
};

export const extractStyleData = (message: string): CelebrityStyleInsightProps => {
  const styleData: CelebrityStyleInsightProps = {
    introduction: "",
    keyElements: [],
    signatureLooks: [],
    preferredBrands: [],
    conclusion: "",
  };

  const sectionRegex =
    /(.+?)(?=Key Elements|Signature Looks|Preferred Brands and Designers|Conclusion|$)/gs;
  const sections = message.match(sectionRegex) || [];

  sections.forEach((section) => {
    const lines = section.trim().split("\n"); // Trim section and split into lines
    let sectionName = lines[0].replace(":", "").trim().toLowerCase();

    const remainingLines = lines.slice(1);
    switch (sectionName) {
      case "introduction":
      case "conclusion":
        styleData[sectionName] = remainingLines.join("\n").trim();
        break;
      case "key elements of jennifer lopez's style":
        sectionName = "keyelements"; // Reassign the value here
      case "signature looks":
      case "preferred brands and designers":
        remainingLines.forEach((line) => {
          const boldItemMatch = line.match(/\*\*(.*?)\*\*/);
          if (boldItemMatch) {
            const [_, itemName] = boldItemMatch;
            const description = line
              .replace(boldItemMatch[0], "")
              .replace(":", "")
              .trim();

            styleData[sectionName].push({ name: itemName.trim(), description });
          }
        });
        break;
    }
  });

  return styleData;
};
