"""
CLI Tool for Building Tutorials with Tuture.
"""

import json

import click

from utils import which, make_steps

CONTEXT_SETTINGS = dict(help_option_names=['-h', '--help'])


@click.group(context_settings=CONTEXT_SETTINGS)
@click.version_option('0.0.1')
def cli():
    """Tuture helps you build interactive, step-by-step tutorials."""
    pass


@cli.command(context_settings=CONTEXT_SETTINGS)
@click.option('--name',
              prompt='Tutorial Name',
              default='My Awesome Tutorial',
              help='Name of the tutorial')
@click.option('--language',
              prompt='Language Code',
              default='zh-hans',
              help='Language code of the tutorial')
@click.option('--topics',
              prompt='Topics Covered',
              help='Covered topics of the tutorial separated with comma')
@click.option('--email',
              prompt='Maintainer Email',
              help='Maintainer email')
def init(name, language, topics, email):
    """Initialize a Tuture tutorial.

    This will place some utilities in the root path of your Git repo.
    """
    if which('git') is None:
        click.echo(
            "No git executable detected. Please make sure Git is "
            "installed on your machine by calling `which git`."
        )
        return

    tuture = {
        'name': name,
        'language': language,
        'maintainer': email,
        'topics': topics.split(','),
        'steps': make_steps(),
    }

    with open('tuture.json', 'w') as fp:
        json.dump(tuture, fp, indent=2)

    click.echo("Successfully initialized a tuture project!")
