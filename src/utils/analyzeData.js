import { CHEAT_KEYWORDS, SUSPICIOUS_REPOS } from "../constants/cheatList";

export function analyzeData(repos, events, username) {
  const findings = [];
  let riskScore = 0;

  // --- Repo analizi ---
  for (const repo of repos) {
    const nameLower = repo.name.toLowerCase();
    const descLower = (repo.description || "").toLowerCase();

    const repoMatches = SUSPICIOUS_REPOS.filter((r) => nameLower.includes(r));
    if (repoMatches.length > 0) {
      riskScore += 40;
      findings.push({
        severity: "high",
        category: "Hile Reposu",
        title: `Şüpheli repo: ${repo.name}`,
        description: "Bu repo bilinen Minecraft hile istemcisiyle eşleşiyor.",
        matches: repoMatches,
        url: repo.html_url,
      });
    }

    const keyMatches = CHEAT_KEYWORDS.filter(
      (k) => nameLower.includes(k) || descLower.includes(k)
    );
    if (keyMatches.length > 0 && repoMatches.length === 0) {
      riskScore += 20;
      findings.push({
        severity: "medium",
        category: "Şüpheli Repo",
        title: `Hile içerikli repo: ${repo.name}`,
        description: "Repo adı veya açıklamasında hile ile ilgili terimler tespit edildi.",
        matches: keyMatches,
        url: repo.html_url,
      });
    }

    if (repo.fork) {
      const forkMatches = [...SUSPICIOUS_REPOS, ...CHEAT_KEYWORDS].filter((k) =>
        nameLower.includes(k)
      );
      if (forkMatches.length > 0) {
        riskScore += 15;
        findings.push({
          severity: "medium",
          category: "Fork Analizi",
          title: `Fork edilmiş şüpheli repo: ${repo.name}`,
          description: "Bu kullanıcı bilinen bir hile projesini fork etmiş.",
          matches: forkMatches,
          url: repo.html_url,
        });
      }
    }
  }

  // --- Event analizi ---
  const commitTexts = [];
  for (const event of events) {
    if (event.type === "PushEvent" && event.payload?.commits) {
      for (const commit of event.payload.commits) {
        commitTexts.push({ text: commit.message.toLowerCase() });
      }
    }

    if (event.type === "ForkEvent" && event.payload?.forkee) {
      const forkName = (event.payload.forkee.full_name || "").toLowerCase();
      const forkMatches = SUSPICIOUS_REPOS.filter((r) => forkName.includes(r));
      if (forkMatches.length > 0) {
        riskScore += 20;
        findings.push({
          severity: "high",
          category: "Fork Aktivitesi",
          title: "Hile projesini fork etti",
          description: "Son aktivitelerinde bilinen bir hile istemcisini fork etmiş.",
          matches: forkMatches,
          url: `https://github.com/${event.payload.forkee.full_name}`,
        });
      }
    }
  }

  const cheatCommits = commitTexts.filter((e) =>
    CHEAT_KEYWORDS.some((k) => e.text.includes(k))
  );
  if (cheatCommits.length > 0) {
    riskScore += 25;
    const matchedWords = [
      ...new Set(
        cheatCommits.flatMap((e) => CHEAT_KEYWORDS.filter((k) => e.text.includes(k)))
      ),
    ];
    findings.push({
      severity: "high",
      category: "Commit Geçmişi",
      title: `Commit mesajlarında hile terimleri (${cheatCommits.length} adet)`,
      description: "Son commit mesajlarında hile ile ilgili içerik tespit edildi.",
      matches: matchedWords,
      url: `https://github.com/${username}`,
    });
  }

  const mcRepos = repos.filter((r) => {
    const t = (r.name + " " + (r.description || "")).toLowerCase();
    return (
      t.includes("minecraft") ||
      t.includes("bukkit") ||
      t.includes("spigot") ||
      t.includes("fabric") ||
      t.includes("forge") ||
      t.includes("paper")
    );
  });

  let verdict;
  if (riskScore === 0) verdict = "clean";
  else if (riskScore < 30) verdict = "suspicious";
  else verdict = "cheater";

  return {
    findings,
    riskScore: Math.min(riskScore, 100),
    verdict,
    mcCount: mcRepos.length,
    repoCount: repos.length,
  };
}
