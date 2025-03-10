import React from 'react';
import MathContent from './MathContent';
import Layout from './Layout';

const MathTest = () => {
  const mathExamples = [
    {
      title: 'Quadratic Formula',
      latex: 'The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ for the equation $ax^2 + bx + c = 0$.'
    },
    {
      title: 'Pythagorean Theorem',
      latex: 'The Pythagorean theorem states that $$a^2 + b^2 = c^2$$'
    },
    {
      title: 'Einstein\'s Mass-Energy Equivalence',
      latex: 'Einstein\'s famous equation: $E = mc^2$'
    },
    {
      title: 'Euler\'s Identity',
      latex: 'Euler\'s identity is $$e^{i\\pi} + 1 = 0$$'
    },
    {
      title: 'Calculus Derivative',
      latex: 'The derivative of $f(x) = x^n$ is $f\'(x) = nx^{n-1}$'
    },
    {
      title: 'Integral',
      latex: '$$\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)$$'
    },
    {
      title: 'Vector Dot Product',
      latex: 'The dot product of two vectors: $\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta$'
    },
    {
      title: 'Matrix',
      latex: '$$A = \\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix}$$'
    }
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">MathJax Test</h1>
        <p className="text-text-secondary">
          Testing MathJax rendering capabilities with various mathematical expressions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mathExamples.map((example, index) => (
          <div key={index} className="card">
            <h2 className="text-xl font-semibold text-accent mb-4">{example.title}</h2>
            <MathContent content={example.latex} />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default MathTest; 