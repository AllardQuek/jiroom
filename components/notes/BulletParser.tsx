interface BulletParserProps {
  text: string;
}

export function BulletParser({ text }: BulletParserProps) {
  if (!text) {
    return null;
  }

  const lines = text.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, index) => {
        const isBullet = line.trim().startsWith('- ');
        const content = isBullet ? line.trim().substring(2) : line;

        if (!content.trim()) {
          return null;
        }

        if (isBullet) {
          return (
            <div key={index} className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>{content}</span>
            </div>
          );
        }

        return <div key={index}>{line}</div>;
      })}
    </div>
  );
}
