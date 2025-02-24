require 'json'
require 'fileutils'

module Jekyll
  class SearchIndexGenerator < Generator
    safe true
    priority :low

    def generate(site)
      # Configure which collections to index
      collections_to_index = {
        'posts' => true,
        'research' => true,
        'tutorials' => true,
        'case_studies' => true
      }

      index = []

      # Index pages
      site.pages.each do |page|
        next if page.data['exclude_from_search'] || !page.data['title']
        index << extract_data(page, 'page')
      end

      # Index collections
      site.collections.each do |collection_name, collection|
        next unless collections_to_index[collection_name]
        
        collection.docs.each do |doc|
          next if doc.data['exclude_from_search']
          index << extract_data(doc, collection_name)
        end
      end

      # Ensure the destination directory exists
      FileUtils.mkdir_p(site.dest)

      # Create search index file
      index_path = File.join(site.dest, 'search-index.json')
      File.write(index_path, JSON.pretty_generate(index))

      # Add to static files
      site.static_files << SearchIndexFile.new(site, site.dest, '/', 'search-index.json')
    end

    private

    def extract_data(item, type)
      data = {
        'url' => item.url,
        'title' => item.data['title'],
        'description' => item.data['description'],
        'content' => strip_html(item.content),
        'type' => type,
        'author' => item.data['author'],
        'excerpt' => item.data['excerpt'] || strip_html(item.content)[0..200]
      }

      # Add date for posts and collection documents
      if item.respond_to?(:date)
        data['date'] = item.date.strftime('%Y-%m-%d')
      end

      # Add categories and tags if they exist
      data['categories'] = item.data['categories'] if item.data['categories']
      data['tags'] = item.data['tags'] if item.data['tags']

      data.compact
    end

    def strip_html(content)
      content.to_s
        .gsub(/<script.*?<\/script>/m, '')
        .gsub(/<!--.*?-->/m, '')
        .gsub(/<style.*?<\/style>/m, '')
        .gsub(/<.*?>/m, '')
        .gsub(/\n+/, ' ')
        .gsub(/\s+/, ' ')
        .strip
    end
  end

  class SearchIndexFile < StaticFile
    def write(dest)
      # Prevent the search index from being written again on subsequent writes
      true
    end
  end
end
