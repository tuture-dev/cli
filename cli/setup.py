from setuptools import setup

setup(
    name='tuture',
    version='0.0.1',
    py_modules=['tuture', 'utils'],
    include_package_data=True,
    install_requires=[
        'click',
    ],
    entry_points='''
        [console_scripts]
        tuture=tuture:cli
    ''',
)
