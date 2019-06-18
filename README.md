# Tsert

![Alt text](screenshot.png "Tsert")

This is a simple CLI tool to rapidly develop HTML. By using this, we can fetch snippet code from github repository and insert directly into given HTML file.

### Usage

Pattern: 
`tsert <component-name> <target-file>`

Example:
 `tsert card-1 index.html`

Currently all the snippet is in this following repo, under /templates folder:
`https://github.com/virkillz/tailstack.git`

## Example

Let say we have blank HTML document called `index.html`.

```

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    
</body>
</html>

```

From the same directory we can do`tsert header-1 index.html`

The result 

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    

<nav class="font-sans bg-white text-center flex justify-between my-4 mx-auto container overflow-hidden">
  <a href="/" class="block text-left">
    <img src="https://stitches-cdn.hyperyolo.com/logo.png" class="h-10 sm:h-10 rounded-full" alt="logo">
  </a>
  <ul class="text-sm text-gray-700  flex items-center">
    <li><a href="#" class="inline-block py-2 px-3 text-gray-900 hover:text-gray-700 no-underline">Products</a></li>
    <li><a href="#" class="inline-block py-2 px-3 text-gray-900 hover:text-gray-700 no-underline">Pricing</a></li>
    <li class="pr-2"><a href="#" class="inline-block py-2 px-3 text-gray-900 hover:text-gray-700 no-underline">FAQs</a></li>
    <li class="pl-2 border-l"><a href="#" class="inline-block py-2 px-3 text-gray-900 hover:text-gray-700 no-underline">Log In</a></li>
    <button class="bg-primary-std hover:bg-primary-light text-white ml-4 py-2 px-3 rounded">
    Sign Up
    </button>
  </ul>
</nav>

</body>
</html>

```


## Installation

install globally

`npm install tsert -g`

