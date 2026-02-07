declare module 'algebrite' {
  /**
   * The main Algebrite instance that provides symbolic mathematics capabilities.
   */
  interface AlgebriteInstance {
    /**
     * Adds the given expressions.
     * @param input The algebraic expression to add.
     */
    add(input: string): AlgebriteResult;

    /**
     * Multiplies the given expressions.
     * @param input The algebraic expression to multiply.
     */
    multiply(input: string): AlgebriteResult;

    /**
     * Divides one expression by another.
     * @param input The algebraic expression to divide.
     */
    divide(input: string): AlgebriteResult;

    /**
     * Raises one expression to the power of another.
     * @param input The expression to be exponentiated.
     */
    power(input: string): AlgebriteResult;

    /**
     * Computes the factorial of an expression.
     * @param input The expression for which the factorial is computed.
     */
    factorial(input: string): AlgebriteResult;

    // Trigonometric Functions
    /**
     * Computes the sine of the given input.
     * @param input The angle in radians.
     */
    sin(input: string): AlgebriteResult;

    /**
     * Computes the cosine of the given input.
     * @param input The angle in radians.
     */
    cos(input: string): AlgebriteResult;

    /**
     * Computes the tangent of the given input.
     * @param input The angle in radians.
     */
    tan(input: string): AlgebriteResult;

    /**
     * Computes the hyperbolic sine of the given input.
     * @param input The angle in radians.
     */
    sinh(input: string): AlgebriteResult;

    /**
     * Computes the hyperbolic cosine of the given input.
     * @param input The angle in radians.
     */
    cosh(input: string): AlgebriteResult;

    /**
     * Computes the hyperbolic tangent of the given input.
     * @param input The angle in radians.
     */
    tanh(input: string): AlgebriteResult;

    /**
     * Computes the inverse sine (arcsine) of the given input.
     * @param input The value for which to compute arcsine.
     */
    arcsin(input: string): AlgebriteResult;

    /**
     * Computes the inverse cosine (arccosine) of the given input.
     * @param input The value for which to compute arccosine.
     */
    arccos(input: string): AlgebriteResult;

    /**
     * Computes the inverse tangent (arctangent) of the given input.
     * @param input The value for which to compute arctangent.
     */
    arctan(input: string): AlgebriteResult;

    // Logarithmic and Exponential Functions
    /**
     * Computes the natural logarithm of the input.
     * @param input The expression for which to compute the logarithm.
     */
    log(input: string): AlgebriteResult;

    /**
     * Computes the exponential function (e^input).
     * @param input The power to raise e to.
     */
    exp(input: string): AlgebriteResult;

    /**
     * Computes the square root of the given expression.
     * @param input The value for which to compute the square root.
     */
    sqrt(input: string): AlgebriteResult;

    // Algebraic Manipulation
    /**
     * Expands an algebraic expression.
     * @param input The expression to expand.
     */
    expand(input: string): AlgebriteResult;

    /**
     * Simplifies an algebraic expression.
     * @param input The expression to simplify.
     */
    simplify(input: string): AlgebriteResult;

    /**
     * Factors an algebraic expression.
     * @param input The expression to factor.
     */
    factor(input: string): AlgebriteResult;

    /**
     * Converts an expression to its rational form.
     * @param input The expression to rationalize.
     */
    rationalize(input: string): AlgebriteResult;

    /**
     * Approximates an expression to a numerical value.
     * @param input The expression to approximate.
     */
    approxAll(input: string): AlgebriteResult;

    // Calculus Operations
    /**
     * Differentiates an expression with respect to a variable.
     * @param input The expression to differentiate.
     * @param variable The variable for differentiation.
     */
    diff(input: string, variable: string): AlgebriteResult;

    /**
     * Computes the integral of an expression with respect to a variable.
     * @param input The expression to integrate.
     * @param variable The variable for integration.
     */
    integral(input: string, variable: string): AlgebriteResult;

    /**
     * Computes the Taylor expansion of an expression.
     * @param input The expression to expand.
     * @param variable The variable in the expression.
     * @param expansionPoint The point at which to expand the expression.
     * @param order The order of the expansion.
     */
    taylor(
      input: string,
      variable: string,
      expansionPoint: number,
      order: number
    ): AlgebriteResult;

    // Numeric Operations
    /**
     * Rounds down an expression to the nearest integer.
     * @param input The expression to round down.
     */
    floor(input: string): AlgebriteResult;

    /**
     * Rounds up an expression to the nearest integer.
     * @param input The expression to round up.
     */
    ceiling(input: string): AlgebriteResult;

    /**
     * Rounds an expression to the nearest integer.
     * @param input The expression to round.
     */
    round(input: string): AlgebriteResult;

    /**
     * Computes the absolute value of an expression.
     * @param input The expression to compute the absolute value for.
     */
    abs(input: string): AlgebriteResult;

    // Special Functions
    /**
     * Computes the Gamma function of the input.
     * @param input The value for which to compute the Gamma function.
     */
    gamma(input: string): AlgebriteResult;

    /**
     * Computes the error function of the input.
     * @param input The value for which to compute the error function.
     */
    erf(input: string): AlgebriteResult;

    /**
     * Computes the Bessel function of the first kind.
     * @param input The order and argument of the Bessel function.
     */
    besselj(input: string): AlgebriteResult;

    /**
     * Computes the Bessel function of the second kind.
     * @param input The order and argument of the Bessel function.
     */
    bessely(input: string): AlgebriteResult;

    // Matrix and Linear Algebra Operations
    /**
     * Computes the determinant of a matrix.
     * @param input The matrix to compute the determinant of.
     */
    det(input: string): AlgebriteResult;

    /**
     * Computes the inverse of a matrix.
     * @param input The matrix to invert.
     */
    inv(input: string): AlgebriteResult;

    /**
     * Computes the eigenvalues and eigenvectors of a matrix.
     * @param input The matrix to compute eigenvalues and eigenvectors for.
     */
    eigen(input: string): AlgebriteResult;

    /**
     * Computes the transpose of a matrix.
     * @param input The matrix to transpose.
     */
    transpose(input: string): AlgebriteResult;

    // Logical Operations
    /**
     * Performs a logical AND operation.
     * @param input The expressions to evaluate with AND.
     */
    and(input: string): AlgebriteResult;

    /**
     * Performs a logical OR operation.
     * @param input The expressions to evaluate with OR.
     */
    or(input: string): AlgebriteResult;

    /**
     * Performs a logical NOT operation.
     * @param input The expression to negate.
     */
    not(input: string): AlgebriteResult;

    /**
     * Tests if two expressions are equal.
     * @param p1 The first expression.
     * @param p2 The second expression.
     */
    equal(p1: string, p2: string): boolean;

    // Polynomial and Factorization Operations
    /**
     * Finds the coefficient of a specific term.
     * @param input The polynomial expression.
     * @param variable The variable whose coefficient is desired.
     */
    coeff(input: string, variable: string): AlgebriteResult;

    /**
     * Factors a polynomial expression.
     * @param input The polynomial to factor.
     */
    factorpoly(input: string): AlgebriteResult;

    /**
     * Computes the greatest common divisor (GCD).
     * @param input The expressions for which to compute the GCD.
     */
    gcd(input: string): AlgebriteResult;

    /**
     * Computes the least common multiple (LCM).
     * @param input The expressions for which to compute the LCM.
     */
    lcm(input: string): AlgebriteResult;

    // Utility Functions
    /**
     * The version of Algebrite being used.
     */
    version: string;

    /**
     * Evaluates an algebraic expression.
     * @param input The expression to evaluate.
     */
    eval(input: string): AlgebriteResult;

    /**
     * Runs an Algebrite script and returns the results.
     * @param input The script to run.
     */
    run(input: string): AlgebriteResult | AlgebriteResult[];

    /**
     * Clears the algebra environment.
     */
    clear(): void;

    /**
     * Approximates radicals in the given input.
     * @param input The expression to approximate.
     */
    approxRadicals(input: string): AlgebriteResult;

    // Pattern Matching and Custom Computations
    /**
     * Clears user-defined patterns.
     */
    clearpatterns(): void;

    /**
     * Defines a pattern for use in simplification.
     * @param input The pattern to define.
     */
    pattern(input: string): AlgebriteResult;

    // Solving Equations and Finding Roots
    /**
     * Finds roots of a polynomial equation.
     * @param input The polynomial to find roots for.
     */
    roots(input: string): AlgebriteResult[];

    /**
     * Solves an algebraic equation.
     * @param input The equation to solve.
     */
    solve(input: string): AlgebriteResult;

    // Printing and Display
    /**
     * Returns the LaTeX representation of an expression.
     * @param input The expression to convert to LaTeX.
     */
    printlatex(input: string): string;

    /**
     * Returns the human-readable representation of an expression.
     * @param input The expression to convert.
     */
    printhuman(input: string): string;

    /**
     * Returns the length of an expression.
     * @param input The expression to evaluate the length of.
     */
    length(input: string): number;
  }

  /**
   * Represents the result of an Algebrite operation.
   */
  interface AlgebriteResult {
    /**
     * Converts the result to a string representation.
     */
    toString(): string;
  }

  /**
   * The default instance of Algebrite.
   */
  const Algebrite: AlgebriteInstance;
  export default Algebrite;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: any;
  export default content;
}
