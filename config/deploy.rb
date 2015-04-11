# configs

username = "makevoid" # or organization usually
app_name = "TeachRTC"
branch   = "test_ui"  # master is used if nil

# deploy

require 'mina/bundler'
require 'mina/git'
# require 'mina/rbenv'  # for rbenv support. (http://rbenv.org)
# require 'mina/rvm'    # for rvm support. (http://rvm.io)

# Basic settings:
#   domain       - The hostname to SSH to.
#   deploy_to    - Path to deploy into.
#   repository   - Git repo to clone from. (needed by mina/git)
#   branch       - Branch name to deploy. (needed by mina/git)

set :domain,      'makevoid.com'
set :deploy_to,   "/www/#{app_name}"
# set :repository,  "git://github.com/#{username}/#{app_name}" # public
set :repository,  "git@github.com:#{username}/#{app_name}"     # private
set :branch,      branch || "master"

# Manually create these paths in shared/ (eg: shared/config/database.yml) in your server.
# They will be linked in the 'deploy:link_shared_paths' step.
set :shared_paths, ['log']

# Optional settings:
set :user, 'www-data'
#   set :port, '30000'     # SSH port number.

# This task is the environment that is loaded for most commands, such as
# `mina deploy` or `mina rake`.
task :environment do
  # If you're using rbenv, use this to load the rbenv environment.
  # Be sure to commit your .rbenv-version to your repository.
  # invoke :'rbenv:load'

  # For those using RVM, use this to load an RVM version@gemset.
  # invoke :'rvm:use[ruby-1.9.3-p125@default]'
end

# Put any custom mkdir's in here for when `mina setup` is ran.
# For Rails apps, we'll make some of the shared paths that are shared between
# all releases.
task :setup => :environment do
  queue! %[mkdir -p "#{deploy_to}/shared/log"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/log"]


  # queue! %[git submodule init && git submodule update && npm install]
end

desc "Deploys the current version to the server."
task :deploy => :environment do
  deploy do
    # Put things that will set up an empty directory into a fully set-up
    # instance of your project.
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'


    # TODO: cache node modules
    queue! %[npm install]

    # invoke :'bundle:install'

    to :launch do
      queue 'mkdir -p tmp'
      queue 'touch tmp/restart.txt'
    end
  end
end

# URL:
#
#     http://teachrtc.mkvd.net/
#


# TODO
#
# execute on the server after deploy
#
#     $ ln -s index.js app.js
#     $ ln -s src/public
#
