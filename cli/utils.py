"""
Utilities for implementing Tuture CLI.
"""

import os
import subprocess

EXPLAIN_PLACEHOLDER = '[YOUR EXPLAINATION HERE]'
FIGURE_PLACEHOLDER = '[YOUR FIGURE HERE]'
DIFF_PATH = '.tuture/diff'


def which(program):
    """Returns if executable of a program exists."""
    def is_exe(fpath):
        return os.path.isfile(fpath) and os.access(fpath, os.X_OK)

    fpath, fname = os.path.split(program)
    if fpath:
        if is_exe(program):
            return program
    else:
        for path in os.environ["PATH"].split(os.pathsep):
            exe_file = os.path.join(path, program)
            if is_exe(exe_file):
                return exe_file

    return None


def _get_git_logs():
    cp = subprocess.run(['git', 'log', '--oneline'], stdout=subprocess.PIPE)
    return cp.stdout.decode().split('\n')[:-1]


def _get_diff(commit):
    cp = subprocess.run(
        ['git', 'show', commit, '--name-only'],
        stdout=subprocess.PIPE
    )
    msg = cp.stdout.decode()

    # NOTE: This processing is highly dependent on Git's output format!
    changed_files = msg.split('\n\n')[-1].split('\n')[:-1]

    diff = list()

    for f in changed_files:
        diff.append({
            'file': f,
            'explain': EXPLAIN_PLACEHOLDER,
        })
    return diff


def _store_diff(commit):
    cp = subprocess.run(['git', 'show', commit], stdout=subprocess.PIPE)
    msg = cp.stdout.decode()
    diff = msg.split('\n\n')[-1]

    if not os.path.exists(DIFF_PATH):
        os.makedirs(DIFF_PATH)

    diff_path = os.path.join(DIFF_PATH, commit + '.diff')
    with open(diff_path, 'w') as fp:
        fp.writelines(diff)


def make_steps():
    steps = list()
    logs = _get_git_logs()

    for commit in reversed(logs):
        uuid, _, msg = commit.partition(' ')
        steps.append({
            'name': msg,
            'commit': uuid,
            'explain': EXPLAIN_PLACEHOLDER,
            'fig': FIGURE_PLACEHOLDER,
            'diff': _get_diff(uuid),
        })
        _store_diff(uuid)

    return steps
