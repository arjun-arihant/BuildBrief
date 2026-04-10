export function formatForCursor(megaPrompt: string, projectName: string): string {
    return `# ${projectName} — .cursorrules\n\n${megaPrompt}`;
}

export function formatForWindsurf(megaPrompt: string, projectName: string): string {
    return `# ${projectName} — .windsurfrules\n\n${megaPrompt}`;
}

export function formatForBolt(megaPrompt: string): string {
    return megaPrompt;
}

export function downloadAsFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}
