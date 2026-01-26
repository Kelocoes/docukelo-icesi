import { useState } from 'react';
import Mermaid from '@theme/Mermaid';

export default function MermaidExample() {
    const [nodes] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']);
    const [edges] = useState([
        { from: 'A', to: 'B', weight: 4 },
        { from: 'A', to: 'C', weight: 2 },
        { from: 'A', to: 'D', weight: 7 },
        { from: 'A', to: 'E', weight: 9 },
        { from: 'A', to: 'F', weight: 12 },
    ]);
    const [startNode, setStartNode] = useState('');
    const [endNode, setEndNode] = useState('');
    const [path, setPath] = useState([]);
    const [totalWeight, setTotalWeight] = useState(0);
    const [message, setMessage] = useState('');

    const findShortestPath = () => {
        if (!nodes.includes(startNode) || !nodes.includes(endNode)) {
            setMessage('Uno o ambos nodos no existen');
            setPath([]);
            setTotalWeight(0);
            return;
        }

        // Algoritmo de Dijkstra
        const distances = {};
        const previous = {};
        const unvisited = new Set(nodes);

        nodes.forEach(node => {
            distances[node] = Infinity;
            previous[node] = null;
        });
        distances[startNode] = 0;

        while (unvisited.size > 0) {
            let currentNode = null;
            let minDistance = Infinity;

            for (const node of unvisited) {
                if (distances[node] < minDistance) {
                    minDistance = distances[node];
                    currentNode = node;
                }
            }

            if (currentNode === null || distances[currentNode] === Infinity) {
                break;
            }

            unvisited.delete(currentNode);

            if (currentNode === endNode) {
                break;
            }

            edges.forEach(edge => {
                let neighbor = null;
                let weight = edge.weight;

                if (edge.from === currentNode && unvisited.has(edge.to)) {
                    neighbor = edge.to;
                }

                if (neighbor) {
                    const alt = distances[currentNode] + weight;
                    if (alt < distances[neighbor]) {
                        distances[neighbor] = alt;
                        previous[neighbor] = currentNode;
                    }
                }
            });
        }

        if (distances[endNode] === Infinity) {
            setMessage('No existe una ruta entre los nodos');
            setPath([]);
            setTotalWeight(0);
            return;
        }

        const shortestPath = [];
        let current = endNode;
        while (current !== null) {
            shortestPath.unshift(current);
            current = previous[current];
        }

        setPath(shortestPath);
        setTotalWeight(distances[endNode]);
        setMessage(`Ruta más corta encontrada: ${shortestPath.join(' → ')} (Peso total: ${distances[endNode]})`);
    };

    const generateMermaidGraph = () => {
        const edgesString = edges.map(edge => {
            const isInPath = path.length > 0 &&
                path.includes(edge.from) &&
                path.includes(edge.to) &&
                Math.abs(path.indexOf(edge.from) - path.indexOf(edge.to)) === 1;

            const fromNode = `${edge.from}((${edge.from}))`;
            const toNode = `${edge.to}((${edge.to}))`;

            return isInPath
                ? `    ${fromNode}==>|${edge.weight}|${toNode};`
                : `    ${fromNode}-->|${edge.weight}|${toNode};`;
        }).join('\n');

        const styleString = path.length > 0
            ? '\n' + path.map(node => `    style ${node} fill:#f96`).join('\n')
            : '';

        return `graph LR;\n${edgesString}${styleString}`;
    };

    return (
        <div>
            <Mermaid value={generateMermaidGraph()} />
            <div style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    placeholder="Nodo inicial"
                    value={startNode}
                    onChange={(e) => setStartNode(e.target.value.toUpperCase())}
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <input
                    type="text"
                    placeholder="Nodo final"
                    value={endNode}
                    onChange={(e) => setEndNode(e.target.value.toUpperCase())}
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <button
                    onClick={findShortestPath}
                    style={{ padding: '8px 16px', cursor: 'pointer' }}
                >
                    Encontrar Ruta Más Corta
                </button>
            </div>
            {message && (
                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
                    {message}
                </p>
            )}
            {totalWeight > 0 && (
                <p style={{ marginTop: '10px', fontSize: '18px', color: '#0066cc' }}>
                    Peso total de la ruta: {totalWeight}
                </p>
            )}
        </div>
    );
}
